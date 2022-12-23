import type { AtomBinded } from '@reatom/core';

export const registry = {
  atoms: {},
  listeners: {},
};

export function runAtom(atom: AtomBinded) {
  registry.atoms[atom.id] = {
    ref: atom,
    cb: () => null,
  };
  registry.atoms[atom.id].unsubscribe = atom.subscribe((...args) =>
    registry.atoms[atom.id].cb(...args),
  );
}
