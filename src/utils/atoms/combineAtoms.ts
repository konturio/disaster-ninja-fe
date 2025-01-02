import { createAtom } from './createPrimitives';
import type { Atom, AtomBinded } from '@reatom/core-v2';

type AtomsMap = { [key: string]: Atom<any> };

export function combineAtoms<T extends AtomsMap>(
  shape: T,
): AtomBinded<{ [key in keyof T]: T[key] extends Atom<infer S> ? S : unknown }> {
  return createAtom(shape, ({ get }, state = {}) => {
    return Object.keys(shape).reduce(
      (acc, key) => {
        acc[key as keyof T] = get(key);
        return acc;
      },
      {} as { [key in keyof T]: T[key] extends Atom<infer S> ? S : unknown },
    );
  });
}
