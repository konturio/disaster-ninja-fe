import { isObject } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import type { Atom, AtomSelfBinded, Action } from '@reatom/core';

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
  nextParams?: P | null;
}

type FetcherFunc<P, T> = (params?: P | null) => Promise<T>;
type FetcherProcessor<T> = () => Promise<T>;
type FetcherCanceller<P> = (context: ResourceCtx<P>) => void;
type FetcherFabric<P, T> = (params?: P | null) => {
  processor: FetcherProcessor<T>;
  canceller?: FetcherCanceller<P>;
  allowCancel?: boolean;
};

export type ResourceCtx<P> = {
  version?: number;
  lastParams?: P | null;
  _refetchable?: boolean;
  canceller?: FetcherCanceller<P>;
  allowCancel?: boolean;
};

function createResourceFetcherAtom<P, T>(
  fetcher: FetcherFunc<P, T> | FetcherFabric<P, T>,
  name: string,
  autoFetchAtom?: Atom,
): ResourceAtomType<P, T> {
  const deps = {
    request: (params: P | null) => params,
    refetch: () => undefined,
    done: (data: T) => data,
    error: (error: string) => error,
    cancel: (nextParams: P | null) => nextParams,
    loading: () => undefined,
    finally: () => null,
  };

  if (autoFetchAtom) {
    deps['autoFetch'] = autoFetchAtom;
  }

  return createAtom(
    deps,
    (
      { onAction, schedule, create, onChange },
      state: ResourceAtomState<T, P> = {
        loading: false,
        data: null,
        error: null,
        canceled: false,
        lastParams: null,
      },
    ) => {
      const newState = { ...state };

      if (autoFetchAtom) {
        // Use this hack to provide lazy resourceAtoms to depend on autofetch atom
        // So, because autofetch atom is in dependency now, no need to manually trigger autofetch atom
        // to start working with atom.subscribe(() => null) (see line 238). Atom will start working automatically when resourceFetcher
        // atom is needed and stop working when all features that require resourceFetcher are off
        // @ts-ignore
        onChange('autoFetch', () => null);
      }

      onAction('request', (params) => {
        newState.lastParams = params ? { ...params } : params;
        newState.loading = true;
        newState.error = null;
        newState.canceled = false;

        schedule(async (dispatch, ctx: ResourceCtx<P>) => {
          const version = (ctx.version ?? 0) + 1;
          ctx._refetchable = true;
          ctx.version = version;
          ctx.lastParams = params; // explicit set that request no have any parameters

          // cancel previous request if we have a special function for it
          if (ctx.canceller) {
            ctx.canceller(ctx);
            ctx.canceller = undefined;
          }
          // extra dispatch allows resource subscribers to proccess cancel event and then
          // process the response of the next event
          if (ctx.allowCancel) dispatch(create('cancel', params));

          let requestAction: Action | null = null;
          try {
            let response: T;
            const fetcherResult =
              params === undefined ? fetcher() : fetcher(params);
            if ('processor' in fetcherResult) {
              const { processor, canceller, allowCancel } = fetcherResult;
              ctx.canceller = canceller;
              ctx.allowCancel = allowCancel || Boolean(canceller);
              response = await processor();
            } else {
              response = await fetcherResult;
            }
            if (ctx.version === version) {
              if (ctx.canceller) {
                ctx.canceller = undefined;
              }

              requestAction = create('done', response);
            }
          } catch (e: any) {
            console.error(`[${name}]:`, e);
            if (ctx.version === version) {
              requestAction = create('error', e.message ?? e ?? true);
            }
          } finally {
            if (requestAction) {
              dispatch([requestAction, create('finally')]);
            }
          }
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
      });

      onAction('cancel', (nextParams) => {
        newState.loading = false;
        newState.error = null;
        newState.canceled = true;
        newState.data = null;
        newState.nextParams = nextParams;
      });

      onAction('error', (error) => (newState.error = error));
      onAction('done', (data) => {
        newState.data = data;
        newState.canceled = false;
        newState.nextParams = null;
      });
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
    cancel: (nextParams: P | null) => P | null;
    loading: () => undefined;
    finally: () => null;
  }
>;

let resourceAtomIndex = 0;
const voidCallback = () => null;

export function createResourceAtom<P, T>(
  fetcher: FetcherFunc<P, T> | FetcherFabric<P, T>,
  paramsAtom?: Atom<P> | ResourceAtom<any, any> | null,
  name = `Resource-${resourceAtomIndex++}`,
  isLazy = false,
): ResourceAtomType<P, T> {
  let resourceFetcherAtom: ResourceAtomType<P, T>;

  if (paramsAtom) {
    const autoFetchAtom = createAtom(
      { paramsAtom },
      ({ onChange, schedule }) => {
        onChange('paramsAtom', (newParams) => {
          schedule((dispatch) => {
            if (isObject(newParams)) {
              // Check states than we can be escalated
              if ('canceled' in newParams && newParams.canceled) {
                dispatch(resourceFetcherAtom.cancel(newParams as unknown as P));
                return;
              }
              if ('loading' in newParams && newParams.loading) {
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

    if (isLazy) {
      resourceFetcherAtom = createResourceFetcherAtom<P, T>(
        fetcher,
        name,
        autoFetchAtom,
      );
    } else {
      resourceFetcherAtom = createResourceFetcherAtom<P, T>(fetcher, name);
      // Start after core modules loaded
      setTimeout(() => {
        autoFetchAtom.subscribe(voidCallback);
      });
    }
  } else {
    resourceFetcherAtom = createResourceFetcherAtom<P, T>(fetcher, name);
    // auto start resource atom that has no params atom controlling it's flow
    resourceFetcherAtom.request.dispatch(null);
  }

  return resourceFetcherAtom;
}
