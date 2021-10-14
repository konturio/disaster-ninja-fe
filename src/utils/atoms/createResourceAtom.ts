import { createAtom, Atom, AtomSelfBinded } from '@reatom/core';

export type ResourceAtom<P, T> = AtomSelfBinded<
  ResourceAtomState<T>,
  {
    request: (params?: P | undefined) => T | undefined;
    refetch: () => undefined;
    done: (data: T) => P;
    error: (error: string) => string;
    finally: () => null;
  }
>;

function createReactiveResourceAtom<P, T>(
  paramsAtom: Atom<P>,
  fetcher: (params?: P | null) => Promise<T> | null,
) {
  return createAtom(
    {
      paramsAtom,
      request: (params: P | null) => params,
      refetch: () => undefined,
      done: (data: T) => data,
      error: (error: string) => error,
      finally: () => null,
    },
    (
      { onAction, onChange, schedule, create },
      state: ResourceAtomState<T> = {
        loading: false,
        data: null,
        error: null,
      },
    ) => {
      onChange('paramsAtom', (params) => {
        schedule((dispatch) => {
          state = { ...state, loading: true };
          dispatch(create('request', params));
        });
      });

      onAction('request', (params) => {
        schedule((dispatch, ctx: ResourceCtx<P>) => {
          const version = (ctx.version ?? 0) + 1;
          ctx.version = version;
          ctx.lastParams = params; // explicit set that request no have any parameters
          const promise = params === undefined ? fetcher() : fetcher(params);
          if (promise !== null) {
            // return from fetcher null, for skip request
            ctx._refetchable = true;
            promise
              .then(
                (response) =>
                  ctx.version === version && create('done', response),
              )
              .catch((error: Error) => {
                console.info('[Create resource atom]', error);
                ctx.version === version && create('error', error.message);
              })
              .then(
                (action) => action && dispatch([action, create('finally')]),
              );
          }
        });
      });

      onAction('refetch', () => {
        schedule((dispatch, ctx: ResourceCtx<P>) => {
          if (ctx._refetchable === false) {
            console.error(
              '[Create resource atom]',
              'Do not call refetch before request',
            );
            return;
          }
          dispatch(create('request', ctx.lastParams as P | null));
        });
      });

      onAction('error', (error) => (state = { ...state, error }));
      onAction('done', (data) => (state = { ...state, data }));
      onAction('finally', () => (state = { ...state, loading: false }));

      return state;
    },
  );
}

function createStaticResourceAtom<T>(fetcher: () => Promise<T> | null) {
  return createAtom(
    {
      request: () => undefined,
      refetch: () => undefined,
      done: (data: T) => data,
      error: (error: string) => error,
      finally: () => null,
    },
    (
      { onAction, onInit, schedule, create },
      state: ResourceAtomState<T> = {
        loading: false,
        data: null,
        error: null,
      },
    ) => {
      onInit(() => {
        state = { ...state, loading: true };
        schedule((dispatch) => {
          dispatch(create('request'));
        });
      });

      onAction('request', () => {
        schedule((dispatch, ctx: ResourceCtx<unknown>) => {
          const version = (ctx.version ?? 0) + 1;
          ctx.version = version;
          const promise = fetcher();
          if (promise !== null) {
            // return from fetcher null, for skip request
            ctx._refetchable = true;
            promise
              .then(
                (response) =>
                  ctx.version === version && create('done', response),
              )
              .catch((error: Error) => {
                console.info('[Create resource atom]', error);
                return (
                  ctx.version === version && create('error', error.message)
                );
              })
              .then(
                (action) => action && dispatch([action, create('finally')]),
              );
          }
        });
      });

      onAction('refetch', () => {
        schedule((dispatch, ctx: ResourceCtx<unknown>) => {
          if (ctx._refetchable === false) {
            console.error(
              '[Create resource atom]',
              'Do not call refetch before request',
            );
            return;
          }
          dispatch(create('request'));
        });
      });

      onAction('error', (error) => (state = { ...state, error }));
      onAction('done', (data) => (state = { ...state, data }));
      onAction('finally', () => (state = { ...state, loading: false }));

      return state;
    },
  );
}

interface ResourceAtomState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

type ResourceCtx<P> = {
  version?: number;
  lastParams?: P | null;
  _refetchable?: boolean;
};

export function createResourceAtom<P, T>(
  paramsAtom: Atom<P> | null,
  fetcher: (params?: P | null) => Promise<T> | null,
) {
  return paramsAtom
    ? createReactiveResourceAtom(paramsAtom, fetcher)
    : createStaticResourceAtom(fetcher);
}
