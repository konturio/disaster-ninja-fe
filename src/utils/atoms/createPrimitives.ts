import { createAtom as createAtomOriginal } from '@reatom/core';
import {
  createBooleanAtom as createBooleanAtomOriginal,
  createPrimitiveAtom as createPrimitiveAtomOriginal,
} from '@reatom/core/primitives';
import { store } from '~core/store/store';
import type { PrimitiveAtom } from '@reatom/core/primitives';
import type { AtomOptions } from '@reatom/core';

const addStoreInOptions = (options) => ({
  store,
  ...(typeof options === 'string' ? { id: options } : options),
});

export const createAtom: typeof createAtomOriginal = (deps, reducer, options) =>
  createAtomOriginal(deps, reducer, addStoreInOptions(options));

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
  type State = Set<Element>;
  return createPrimitiveAtomOriginal(
    initState,
    {
      set: (state, el: Element): State => {
        if (state.has(el)) return state;
        return new Set(state).add(el);
      },
      delete: (state, el: Element): State => {
        const newState = (state = new Set(state));
        if (!newState.delete(el)) return state;
        return newState;
      },
      clear: (): State => new Set(),
      change: (state, cb: (stateCopy: State) => State): State =>
        cb(new Set(state)),
    },
    addStoreInOptions(options),
  );
}

export function createMapAtom<Key, Element>(
  initState = new Map<Key, Element>(),
  options: AtomOptions<Map<Key, Element>> = `map${++count}`,
) {
  type State = Map<Key, Element>;
  return createPrimitiveAtomOriginal(
    initState,
    {
      set: (state, key: Key, el: Element) => {
        if (state.get(key) === el) return state;
        return new Map(state).set(key, el);
      },
      delete: (state, key: Key) => {
        const newState = (state = new Map(state));
        if (!newState.delete(key)) return state;
        return newState;
      },
      clear: () => new Map(),
      change: (state, cb: (stateCopy: State) => State) => cb(new Map(state)),
    },
    addStoreInOptions(options),
  );
}
