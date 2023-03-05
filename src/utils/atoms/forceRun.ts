import type { Atom } from '@reatom/core-v2';
/**
 * Atoms computed by lazy algorithm - without subscribers atom don't do anything,
 * but in case with stateless atoms we want to run atom event them event without subscribers.
 * This util help with it.
 */
type AtomWithSubscribe = Atom & { subscribe(cb: () => void): () => void };
export function forceRun(atoms: AtomWithSubscribe | AtomWithSubscribe[]) {
  if (!Array.isArray(atoms)) atoms = [atoms];
  const unsubscribes = atoms.map((atom) => atom.subscribe(() => null));
  return () => unsubscribes.forEach((u) => u());
}
