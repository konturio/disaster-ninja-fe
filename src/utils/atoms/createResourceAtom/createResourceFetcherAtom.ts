import { createAtom } from '~utils/atoms/createPrimitives';
import type { Atom, Store, AtomSelfBinded } from '@reatom/core';

type ResourceCtx<P> = {
  version?: number;
  lastParams?: P | null;
  _refetchable?: boolean;
  allowCancel?: boolean;
};

export function createResourceFetcherAtom<P, T>(
  fetcher: FetcherFunc<P, T>,
  { name: string, store: Store },
) {
  const deps = {
    request: (params: P | null) => params,
    refetch: () => undefined,
    done: (data: T) => data,
    error: (error: string) => error,
    cancel: (nextParams: P | null) => nextParams,
    loading: () => undefined,
    finally: () => null,
  };

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
