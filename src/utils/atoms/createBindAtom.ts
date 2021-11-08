import { createAtom as createAtomOriginal } from '@reatom/core';
import { store } from '~core/store/store';

export const createBindAtom: typeof createAtomOriginal = (
  deps,
  reducer,
  options,
) =>
  createAtomOriginal(deps, reducer, {
    ...(typeof options === 'string' ? { id: options } : options),
    store,
  });
