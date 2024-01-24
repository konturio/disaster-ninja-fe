import type { Store } from '@reatom/core-v2';
import type { Atom, AtomBinded, AtomSelfBinded, AtomState } from '@reatom/core-v2';

export type Fetcher<I, O> = (params: I, abortController: AbortController) => Promise<O>;

export interface AsyncAtomState<P, D> {
  loading: boolean;
  error: string | null;
  data: D | null;
  /* Params that used for request last time */
  lastParams: P | null;
  /* Is this even been requested? False after first request action */
  dirty: boolean;
}

export type AsyncAtomOptions<R, I> = {
  /**
   * Affect only atoms with null in deps.
   * If true - atom will requested on first read / subscribe
   * If false - atom will requested only after 'request' action
   */
  auto?: boolean;
  /**
   * Should this atom inherit states (like loading, error and canceled) from parent atom or not.
   * Useful in case when you chain resource atoms.
   */
  inheritState?: boolean;
  store?: Store;
  onSuccess?: (dispatch: Store['dispatch'], request: I, result: R) => void;
  verbose?: boolean;
};

export type AsyncAtomDeps<
  D extends AtomBinded,
  F extends Fetcher<Exclude<AtomState<D>, null>, any>,
> = {
  request: (params?: Exclude<AtomState<D>, null>) => typeof params;
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
  depsAtom?: Atom<AsyncAtomState<unknown, unknown>> | Atom<unknown>;
};

export type AsyncAnyAtom<
  D extends AtomBinded<any> = AtomBinded<any>,
  F extends Fetcher<AtomState<D> | null, any> = () => Promise<AtomState<D>>,
> = AtomSelfBinded<
  AsyncAtomState<AtomState<D>, Awaited<ReturnType<F>>>,
  AsyncAtomDeps<D, F>
>;
