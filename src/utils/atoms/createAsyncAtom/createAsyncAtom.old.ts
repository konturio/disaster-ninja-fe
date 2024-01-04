import { isObject } from '@reatom/core-v2';
import { createAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
import { isErrorWithMessage } from '~utils/common';
import { abortable, ABORT_ERROR_MESSAGE, isAbortError } from './abort-error';
import { isAtomLike } from './is-atom-like';
import type { AsyncAtomOptions, AsyncAtomState, Fetcher, AsyncAtomDeps } from './types';
import type { AtomBinded, AtomSelfBinded, AtomState } from '@reatom/core-v2';

const verbose = true;
const filterByAtomName = '';
const logger =
  (name: string) =>
  (...args: Array<string>) => {
    if (!verbose) return;
    // eslint-disable-next-line
    console.log(...args);
  };

type ResourceCtx = {
  abortController?: null | AbortController;
  activeRequest?: Promise<any>;
};

const defaultOptions: AsyncAtomOptions<never, never> = {
  inheritState: false,
  store: store,
  auto: true,
};

/* Check that name unique */
const getUniqueId = ((mem) => {
  return (newId: string): string => {
    if (!mem.has(newId)) {
      mem.add(newId);
      return newId;
    }

    // HRM sometime can double atoms, and this can create bugs
    console.warn(`Atom with name ${newId} already exist. Full page reload recommended`);
    const uniqId = newId + performance.now();
    return getUniqueId(uniqId);
  };
})(new Set());

export function createAsyncAtom<
  F extends Fetcher<Exclude<AtomState<D>, null>, Awaited<ReturnType<F>>>,
  D extends AtomBinded,
>(
  atom: D | null,
  fetcher: F,
  name: string,
  resourceAtomOptions: AsyncAtomOptions<Awaited<ReturnType<F>>, AtomState<D>> = {},
): AtomSelfBinded<
  AsyncAtomState<AtomState<D>, Awaited<ReturnType<F>>>,
  AsyncAtomDeps<D, F>
> {
  const log = logger(name);

  const options: AsyncAtomOptions<Awaited<ReturnType<F>>, AtomState<D>> = {
    ...resourceAtomOptions,
    auto: resourceAtomOptions.auto ?? defaultOptions.auto,
    inheritState: resourceAtomOptions.inheritState ?? defaultOptions.inheritState,
    store: resourceAtomOptions.store ?? defaultOptions.store,
  };

  const deps: AsyncAtomDeps<D, F> = {
    request: (params) => params,
    refetch: () => null,
    cancel: () => null,
    _done: (params, data) => ({ params, data }),
    _error: (params, error) => ({ params, error }),
    _loading: (params) => ({ params }),
  };

  if (atom) {
    deps.depsAtom = atom;
  }

  const resourceAtom: AtomSelfBinded<
    AsyncAtomState<AtomState<D>, Awaited<ReturnType<F>>>,
    AsyncAtomDeps<D, F>
  > = createAtom(
    deps,
    (
      { onAction, schedule, create, onChange, get },
      state: AsyncAtomState<AtomState<D>, Awaited<ReturnType<F>>> = {
        loading: false,
        data: null,
        error: null,
        lastParams: null,
        dirty: false,
      },
    ) => {
      type Context = ResourceCtx;
      const newState = { ...state };

      onAction('request', (params) => {
        newState.dirty = true; // For unblock refetch
        schedule(async (dispatch, ctx: Context) => {
          log('1. Request', params);
          // Before making new request we should abort previous request
          // If some request active right now we have abortController
          if (ctx.abortController) {
            log('2. Cancel flow');
            ctx.abortController.abort();
            delete ctx.abortController;
            /**
             * In case when we cancel active request by another request
             * without this lines we have wrong sequence
             * 1) Loading A
             *    (new request)
             * 2) Loading B
             * 3) Error - A canceled
             *
             * This hackish solution the only way I found to make order correct
             * 1) Loading A
             *    (new request)
             * 2) Error - A canceled
             * 3) Loading B
             */
            let isAfterAbort = false;
            try {
              log('2.1. Cancel flow: await activeRequest');
              await ctx.activeRequest!;
            } catch (e) {
              log('2.2. Cancel flow: activeRequest have error');
              isAfterAbort = isAbortError(e);
            }
            if (isAfterAbort) {
              log('2.3. Cancel flow: activeRequest was canceled');
              // This is abort transaction just for abort previous request.
              // Move this request to next transaction
              log('2.4. Repeat request');
              dispatch(create('request', params));
            } // else - just regular error, no additional actions
            return;
          }
          log('3. Set loading state');
          dispatch(create('_loading', params));
          const abortController = new AbortController();
          try {
            ctx.abortController = abortController;
            ctx.activeRequest = abortable(
              abortController,
              fetcher(params, abortController),
            );
            log('4. Wait result');
            const fetcherResult = await ctx.activeRequest;
            if (fetcherResult === undefined)
              console.warn('resourceAtom: fetcherResult undefined');
            delete ctx.activeRequest;
            log('5. Check that it was aborted:');
            abortController.signal.throwIfAborted(); // Alow set canceled state, even if abort error was catched inside fetcher
            log('5.1.A. request was not aborted');
            // Check that new request was not created
            if (ctx.abortController === abortController) {
              log('5.1.A.1. Done');
              delete ctx.abortController;
              dispatch(create('_done', params, fetcherResult));
              if (options.onSuccess) {
                options.onSuccess(dispatch, params, fetcherResult);
              }
            }
          } catch (e) {
            if (isAbortError(e)) {
              log('5.1.B. request was aborted');
              log('5.1.B.1. Error');
              dispatch(create('_error', params, ABORT_ERROR_MESSAGE));
            } else if (ctx.abortController === abortController) {
              delete ctx.abortController;
              log('5.1.C Not abort error');
              console.error(`[${name}]:`, e);
              const errorMessage = isErrorWithMessage(e)
                ? e.message
                : typeof e === 'string'
                  ? e
                  : 'Unknown';
              dispatch(create('_error', params, errorMessage));
            }
          }
        });
      });

      // Force refetch, useful for polling
      onAction('refetch', () => {
        schedule((dispatch, ctx: Context) => {
          if (state.dirty && !state.loading) {
            dispatch(create('request', newState.lastParams!));
          } else {
            console.error(`[${name}]:`, 'Do not call refetch before request');
          }
        });
      });

      onAction('cancel', () => {
        schedule(async (dispatch, ctx: Context) => {
          if (ctx.abortController) {
            ctx.abortController.abort();
            delete ctx.abortController;
          }
        });
      });

      onAction('_loading', ({ params }) => {
        newState.loading = true;
        newState.error = null;
        newState.lastParams = params;
      });

      onAction('_error', ({ params, error }) => {
        newState.error = error;
        newState.lastParams = params;
        newState.loading = false;
      });

      onAction('_done', ({ data, params }) => {
        newState.data = data;
        newState.error = null;
        newState.loading = false;
        newState.lastParams = params;
      });

      if (deps.depsAtom) {
        onChange('depsAtom', (depsAtomState: unknown) => {
          if (isObject(depsAtomState)) {
            // Deps is resource atom-like object
            if (options.inheritState) {
              newState.loading = depsAtomState.loading || newState.loading;
              newState.error = depsAtomState.error || newState.error;
            }

            if (isAtomLike(depsAtomState)) {
              if (!depsAtomState.loading && !depsAtomState.error && depsAtomState.dirty) {
                schedule((dispatch) =>
                  dispatch(create('request', depsAtomState.data as any)),
                );
              }
            } else {
              // Is plain object
              schedule((dispatch) => dispatch(create('request', depsAtomState as any)));
            }
          } else {
            // Deps is primitive
            if (depsAtomState !== null)
              schedule((dispatch) => dispatch(create('request', depsAtomState as any)));
            else {
              console.warn(
                `Resource atom with name ${name} skips running as its dependency state ${deps?.depsAtom?.id} is null`,
              );
            }
          }
        });
      } else {
        if (options.auto && !newState.dirty) {
          schedule((dispatch) => dispatch(create('request', null as any)));
        }
      }

      return newState;
    },
    {
      id: getUniqueId(name),
      store: options.store,
      decorators: [],
    },
  );

  return resourceAtom;
}
