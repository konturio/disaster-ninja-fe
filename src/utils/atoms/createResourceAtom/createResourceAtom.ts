import { isObject } from '@reatom/core';
import { memo } from '@reatom/core/experiments';
import { createAtom, createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
import { isErrorWithMessage } from '~utils/common';
import { ABORT_ERROR_MESSAGE, isAbortError } from './abort-error';
import type { ResourceAtomOptions, ResourceAtomState, Fetcher } from './types';
import type { Action, Atom, AtomBinded, AtomSelfBinded, AtomState } from '@reatom/core';

type ResourceCtx = {
  abortController?: null | AbortController;
  activeRequest?: Promise<any>;
};

const defaultOptions: ResourceAtomOptions = {
  inheritState: false,
  store: store,
};

type Deps<D extends AtomBinded, F extends Fetcher<AtomState<D> | null, any>> = {
  request: (params: AtomState<D>) => typeof params;
  refetch: () => null;
  cancel: () => null;
  _done: (
    params: AtomState<D>,
    data: Awaited<ReturnType<F>>,
  ) => { params: typeof params; data: typeof data };
  _error: (
    params: AtomState<D>,
    error: string,
  ) => { params: typeof params; error: typeof error };
  _loading: (params: AtomState<D>) => { params: typeof params };
  _finally: () => null;
  depsAtom?: Atom<ResourceAtomState<unknown, unknown>> | Atom<unknown>;
};

export function createResourceAtom<
  F extends Fetcher<AtomState<D> | null, any>,
  D extends AtomBinded,
>(
  atom: D | null,
  fetcher: F,
  name: string,
  resourceAtomOptions: ResourceAtomOptions = {},
): AtomSelfBinded<ResourceAtomState<AtomState<D>, Awaited<ReturnType<F>>>, Deps<D, F>> {
  const options: ResourceAtomOptions = {
    lazy: resourceAtomOptions.lazy ?? defaultOptions.lazy,
    inheritState: resourceAtomOptions.inheritState ?? defaultOptions.inheritState,
    store: resourceAtomOptions.store ?? defaultOptions.store,
  };

  const deps: Deps<D, F> = {
    request: (params) => params,
    refetch: () => null,
    cancel: () => null,
    _done: (params, data) => ({ params, data }),
    _error: (params, error) => ({ params, error }),
    _loading: (params) => ({ params }),
    _finally: () => null,
  };

  if (atom) {
    deps.depsAtom = atom;
  }

  const resourceAtom: AtomSelfBinded<
    ResourceAtomState<AtomState<D>, Awaited<ReturnType<F>>>,
    Deps<D, F>
  > = createAtom(
    deps,
    (
      { onAction, schedule, create, onChange },
      state: ResourceAtomState<AtomState<D>, Awaited<ReturnType<F>>> = {
        loading: false,
        data: null,
        error: null,
        lastParams: null,
        dirty: true,
      },
    ) => {
      type Context = ResourceCtx;
      const newState = { ...state };

      onAction('request', (params) => {
        newState.dirty = false; // For unblock refetch
        schedule(async (dispatch, ctx: Context) => {
          // Before making new request we should abort previous request
          // If some request active right now we have abortController
          if (ctx.abortController) {
            ctx.abortController.abort();
            ctx.abortController = null;
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
            const isAfterAbort = await ctx.activeRequest!.catch((e: unknown) =>
              isAbortError(e),
            );
            if (isAfterAbort) {
              dispatch(create('request', params));
            }
            return;
          }
          dispatch(create('_loading', params));
          const abortController = new AbortController();
          let requestAction: Action | null = null;
          try {
            ctx.abortController = abortController;
            ctx.activeRequest = fetcher(params, abortController);
            const fetcherResult = await ctx.activeRequest;

            abortController.signal.throwIfAborted(); // Alow set canceled state, even if abort error was catched inside fetcher
            if (ctx.abortController === abortController) {
              // Check that new request was not created
              requestAction = create('_done', params, fetcherResult);
            }
          } catch (e) {
            if (isAbortError(e)) {
              requestAction = create('_error', params, ABORT_ERROR_MESSAGE);
            } else if (ctx.abortController === abortController) {
              console.error(`[${name}]:`, e);
              const errorMessage = isErrorWithMessage(e)
                ? e.message
                : typeof e === 'string'
                ? e
                : 'Unknown';
              requestAction = create('_error', params, errorMessage);
            }
          } finally {
            if (requestAction) {
              dispatch([requestAction, create('_finally')]);
            }
          }
        });
      });

      // Force refetch, useful for polling
      onAction('refetch', () => {
        schedule((dispatch, ctx: Context) => {
          if (!state.dirty) {
            console.error(`[${name}]:`, 'Do not call refetch before request');
            return;
          }
          dispatch(create('request', newState.lastParams!));
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
      });

      onAction('_done', ({ data, params }) => {
        newState.data = data;
        newState.error = null;
        newState.lastParams = params;
      });

      onAction('_finally', () => {
        newState.loading = false;
      });

      if (deps.depsAtom) {
        onChange('depsAtom', (depsAtomState: unknown) => {
          if (isObject(depsAtomState)) {
            // Deps is resource atom-like object
            if (options.inheritState) {
              newState.loading = depsAtomState.loading || newState.loading;
              newState.error = depsAtomState.error || newState.error;
            }

            if (!depsAtomState.loading && !depsAtomState.error) {
              schedule((dispatch) => dispatch(create('request', depsAtomState as any)));
            }
          } else {
            // Deps is primitive
            schedule((dispatch) => dispatch(create('request', depsAtomState as any)));
          }
        });
      }
      return newState;
    },
    {
      id: name,
      decorators: [memo()], // This prevent updates when prev state and next state deeply equal
    },
  );

  return resourceAtom;
}
