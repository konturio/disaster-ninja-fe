import type { AtomBinded } from '@reatom/core-v2';
export type { AppConfig } from './types';
export const appRegistry = {
  atoms: {},
  listeners: {},
};

export function runAtom(atom: AtomBinded) {
  appRegistry.atoms[atom.id] = {
    ref: atom,
    cb: () => null,
  };
  appRegistry.atoms[atom.id].unsubscribe = atom.subscribe((...args) =>
    appRegistry.atoms[atom.id].cb(...args),
  );
}
