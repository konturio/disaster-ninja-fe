import { createAtom, Atom } from '@reatom/core';

interface ResourceAtomState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

type ResourceCtx = {
  version?: number;
};

export function createResourceAtom<P, T>(
  paramsAtom: Atom<P>,
  fetcher: (params: P) => Promise<T>,
) {
  return createAtom(
    {
      paramsAtom,
      request: (params: P) => params,
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
          dispatch(create('request', params));
        });
      });

      onAction('request', (params) =>
        schedule((dispatch, ctx: ResourceCtx) => {
          const version = (ctx.version ?? 0) + 1;
          ctx.version = version;
          fetcher(params)
            .then(
              (response) => ctx.version === version && create('done', response),
            )
            .catch((error) => ctx.version === version && create('error', error))
            .then((action) => action && dispatch([action, create('finally')]));
        }),
      );

      onAction('error', (error) => (state = { ...state, error }));
      onAction('done', (data) => (state = { ...state, data }));
      onAction('finally', () => (state = { ...state, loading: false }));

      return state;
    },
  );
}
