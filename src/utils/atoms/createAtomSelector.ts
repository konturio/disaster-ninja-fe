import { createAtom } from '@reatom/core-v2';
import type { Atom, AtomState, Fn } from '@reatom/core-v2';

export function createAtomSelector<T extends Atom, Res>(
  atom: T,
  reducer: Fn<[AtomState<T>], Res>,
) {
  return createAtom({ atom }, ({ get }) => {
    return reducer(get('atom'));
  });
}
