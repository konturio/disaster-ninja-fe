import type { Atom, AtomState, Store, AtomSelfBinded } from '@reatom/core';

export type Fetcher<I, O> = (
  params: I,
  abortController: AbortController,
) => Promise<O>;

export interface ResourceAtomState<P, D> {
  loading: boolean;
  error: string | null;
  data: D | null;
  /* Params that used for request last time */
  lastParams: P | null;
}

export type ResourceAtomOptions = {
  /** If true - fetcher will be triggered only if atom have subscribers */
  lazy?: boolean;
  /**
   * Should this atom inherit states (like loading, error and canceled) from parent atom or not.
   * Useful in case when you chain resource atoms.
   */
  inheritState?: boolean;
  store?: Store;
};
