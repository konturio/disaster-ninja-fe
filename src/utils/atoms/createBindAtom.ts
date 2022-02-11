import { AtomOptions, createAtom as createAtomOriginal } from '@reatom/core';
import {
  createBooleanAtom as createBooleanAtomOriginal,
  createPrimitiveAtom as createPrimitiveAtomOriginal,
  createSetAtom as createSetAtomOriginal,
  createMapAtom as createMapAtomOriginal,
  PrimitiveAtom,
} from '@reatom/core/primitives';
import { store } from '~core/store/store';

const addStoreInOptions = (options) => ({
  ...(typeof options === 'string' ? { id: options } : options),
  store,
});

export const createBindAtom: typeof createAtomOriginal = (
  deps,
  reducer,
  options,
) => createAtomOriginal(deps, reducer, addStoreInOptions(options));

export const createBooleanAtom: typeof createBooleanAtomOriginal = (
  initState,
  options,
) => createBooleanAtomOriginal(initState, addStoreInOptions(options));

export function createPrimitiveAtom<State>(
  initState: State,
  actions?: null | undefined,
  options?: AtomOptions<State>,
): PrimitiveAtom<State> {
  return createPrimitiveAtomOriginal(
    initState,
    actions,
    addStoreInOptions(options),
  );
}

let count = 0;
export function createSetAtom<Element>(
  initState = new Set<Element>(),
  options: AtomOptions<Set<Element>> = `set${++count}`,
) {
  return createSetAtomOriginal(initState, addStoreInOptions(options));
}

export function createMapAtom<Key, Element>(
  initState = new Map<Key, Element>(),
  options: AtomOptions<Map<Key, Element>> = `map${++count}`,
) {
  return createMapAtomOriginal(initState, addStoreInOptions(options));
}
