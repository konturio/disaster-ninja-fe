import type { Atom, AtomSelfBinded } from '@reatom/core';
import { isObject } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';

export type ResourceAtom<P, T> = AtomSelfBinded<
  ResourceAtomState<T, P>,
  {
    request: (params?: P | undefined) => T | undefined;
    refetch: () => undefined;
    done: (data: T) => P;
    error: (error: string) => string;
    finally: () => null;
  }
>;

interface ResourceAtomState<T, P> {
  loading: boolean;
  error: string | null;
  data: T | null;
  canceled: boolean;
  lastParams: P | null;
}

type ResourceCtx<P> = {
  version?: number;
  lastParams?: P | null;
  _refetchable?: boolean;
};

function createResourceFetcherAtom<P, T>(
  fetcher: (params?: P | null) => Promise<T>,
  name: string,
) {
  return createAtom(
    {
      request: (params: P | null) => params,
      refetch: () => undefined,
      done: (data: T) => data,
      error: (error: string) => error,
      cancel: () => undefined,
      loading: () => undefined,
      finally: () => null,
    },
    (
      { onAction, schedule, create },
      state: ResourceAtomState<T, P> = {
        loading: false,
        data: null,
        error: null,
        canceled: false,
        lastParams: null,
      },
    ) => {
      const newState = { ...state };

      onAction('request', (params) => {
        newState.lastParams = params ? { ...params } : params;
        newState.loading = true;
        newState.error = null;
        newState.canceled = false;
        schedule((dispatch, ctx: ResourceCtx<P>) => {
          const version = (ctx.version ?? 0) + 1;
          ctx._refetchable = true;
          ctx.version = version;
          ctx.lastParams = params; // explicit set that request no have any parameters
          (params === undefined ? fetcher() : fetcher(params))
            .then((response) => {
              if (ctx.version === version) {
                return create('done', response);
              }
            })
            .catch((error: Error) => {
              console.error(`[${name}]:`, error);
              if (ctx.version === version) {
                return create('error', error.message ?? error ?? true);
              }
            })
            .then((action) => {
              if (action) {
                dispatch([action, create('finally')]);
              }
            });
        });
      });

      // Force refetch, usefull for polling
      onAction('refetch', () => {
        schedule((dispatch, ctx: ResourceCtx<P>) => {
          if (ctx._refetchable === false) {
            console.error(`[${name}]:`, 'Do not call refetch before request');
            return;
          }
          dispatch(create('request', ctx.lastParams as P | null));
        });
      });

      onAction('loading', () => {
        newState.loading = true;
        newState.error = null;
        newState.canceled = false;
        schedule((_, ctx: ResourceCtx<P>) => {
          ctx.version = (ctx.version ?? 0) + 1;
        });
      });

      onAction('cancel', () => {
        newState.loading = false;
        newState.error = null;
        newState.canceled = true;
        newState.data = null;
        schedule((dispatch, ctx: ResourceCtx<P>) => {
          const version = (ctx.version ?? 0) + 1;
          ctx.version = version;
        });
      });

      onAction('error', (error) => (newState.error = error));
      onAction('done', (data) => (newState.data = data));
      onAction('finally', () => (newState.loading = false));

      // Significant reduce renders count
      // Replace it with memo decorator if it cause of bugs
      return state.loading === true && newState.loading === true
        ? state
        : newState;
    },
    name,
  );
}

/**
 * You can chain this resources!
 * The demo:
 * https://codesandbox.io/s/reatom-resource-atom-complex-qwi3h
 */

export type ResourceAtomType<P, T> = AtomSelfBinded<
  ResourceAtomState<T, P>,
  {
    request: (params: P | null) => P | null;
    refetch: () => undefined;
    done: (data: T) => T;
    error: (error: string) => string;
    cancel: () => undefined;
    loading: () => undefined;
    finally: () => null;
  }
>;

let resourceAtomIndex = 0;

export function createResourceAtom<P, T>(
  fetcher: (params?: P | null) => Promise<T>,
  paramsAtom?: Atom<P> | ResourceAtom<any, any> | null,
  name = `Resource-${resourceAtomIndex++}`,
): ResourceAtomType<P, T> {
  const resourceFetcherAtom = createResourceFetcherAtom(fetcher, name);

  if (paramsAtom) {
    const autoFetchAtom = createAtom(
      { paramsAtom },
      ({ onChange, schedule }) => {
        onChange('paramsAtom', (newParams) => {
          schedule((dispatch) => {
            if (isObject(newParams)) {
              // Check states than we can be escalated
              if ('canceled' in newParams && newParams.canceled === true) {
                dispatch(resourceFetcherAtom.cancel());
                return;
              }
              if ('loading' in newParams && newParams.loading === true) {
                dispatch(resourceFetcherAtom.loading());
                return;
              }
              if ('error' in newParams && newParams.error !== null) {
                dispatch([
                  resourceFetcherAtom.error(newParams.error),
                  resourceFetcherAtom.finally(),
                ]);
                return;
              }
              if ('data' in newParams) {
                dispatch(resourceFetcherAtom.request(newParams.data));
                return;
              }
            }
            // If not, just pass data to fetcher
            dispatch(resourceFetcherAtom.request(newParams));
          });
        });
      },
    );
    // Start after core modules loaded
    setTimeout(() => {
      autoFetchAtom.subscribe(() => null);
    });
  }
  return resourceFetcherAtom;
}
