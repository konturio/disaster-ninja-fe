import type { Atom, AtomState, Store, AtomSelfBinded } from '@reatom/core';

export interface ResourceAtomState<F extends (params: any) => Promise<any>> {
  loading: boolean;
  error: string | null;
  data: Awaited<ReturnType<F>>;
  canceled: boolean;
  lastParams: Parameters<F>;
  nextParams?: Parameters<F>;
}

export type ResourceAtomOptions = {
  /** If true - fetcher will be triggered only if atom have subscribers */
  lazy?: boolean;
  store?: Store;
};
