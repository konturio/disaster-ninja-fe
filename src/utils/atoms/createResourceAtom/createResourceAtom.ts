import { isObject } from '@reatom/core';
import { memo } from '@reatom/core/experiments';
import { createAtom, createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
import { isErrorWithMessage } from '~utils/common';
import { ABORT_ERROR_MESSAGE, isAbortError } from './abort-error';
import type { ResourceAtomOptions, ResourceAtomState, Fetcher } from './types';
import type {
  Action,
  Atom,
  AtomBinded,
  AtomSelfBinded,
  AtomState,
} from '@reatom/core';

type ResourceCtx = {
  abortController?: null | AbortController;
};

const defaultOptions: ResourceAtomOptions = {
  lazy: true,
  inheritState: false,
  store: store,
};

export function createResourceAtom<
  F extends Fetcher<AtomState<D>, any>,
  D extends Atom<any>,
>(
  atom: D,
  fetcher: F,
  name: string,
  resourceAtomOptions?: ResourceAtomOptions,
): AtomSelfBinded<ResourceAtomState<AtomState<D>, Awaited<ReturnType<F>>>>;
export function createResourceAtom<F extends Fetcher<D, any>, D = null>(
  atom: null,
  fetcher: F,
  name: string,
  resourceAtomOptions?: ResourceAtomOptions,
): AtomSelfBinded<ResourceAtomState<null, Awaited<ReturnType<F>>>>;
export function createResourceAtom<
  F extends Fetcher<AtomState<D> | null, any>,
  D extends Atom<any>,
>(
  atom: D | null,
  fetcher: F,
  name: string,
  resourceAtomOptions?: ResourceAtomOptions,
): AtomBinded {
  const options = Object.assign(resourceAtomOptions ?? {}, defaultOptions);
  let wasNeverRequested = true; // Is this even been requested? False after first request action

  type Deps = {
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
    _loading: () => null;
    _finally: () => null;
    depsAtom?: Atom<ResourceAtomState<unknown, unknown>> | Atom<unknown>;
  };

  const deps: Deps = {
    request: (params) => params,
    refetch: () => null,
    cancel: () => null,
    _done: (params, data) => ({ params, data }),
    _error: (params, error) => ({ params, error }),
    _loading: () => null,
    _finally: () => null,
  };

  if (atom) {
    deps.depsAtom = atom;
  }

  return createAtom(
    deps,
    (
      { onAction, schedule, create, onChange },
      state: ResourceAtomState<AtomState<D>, Awaited<ReturnType<F>>> = {
        loading: false,
        data: null,
        error: null,
        lastParams: null,
      },
    ) => {
      type Context = ResourceCtx;
      const newState = { ...state };

      onAction('request', (params) => {
        wasNeverRequested = false; // For unblock refetch
        newState.loading = true;

        schedule(async (dispatch, ctx: Context) => {
          // Before making new request we should abort previous request
          // If some request active right now we have abortController
          if (ctx.abortController) {
            ctx.abortController.abort();
          }

          const abortController = new AbortController();
          let requestAction: Action | null = null;
          try {
            ctx.abortController = abortController;
            const fetcherResult = await fetcher(params, abortController);
            abortController.signal.throwIfAborted(); // Alow process canceled request event of error was catched in fetcher
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
          if (wasNeverRequested) {
            console.error(`[${name}]:`, 'Do not call refetch before request');
            return;
          }
          dispatch(create('request', newState.lastParams!));
        });
      });

      onAction('_loading', () => {
        newState.loading = true;
        newState.error = null;
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
        onChange('depsAtom', (depsAtom: unknown) => {
          schedule((dispatch) => dispatch(create('request', depsAtom as any)));
          if (options.inheritState) {
            if (isObject(depsAtom)) {
              newState.loading = depsAtom.loading || newState.loading;
              newState.error = depsAtom.error || newState.error;
            }
          }
        });
      }
    },
    {
      id: name,
      decorators: [memo()], // This prevent updates when prev state and next state deeply equal
    },
  );
}
