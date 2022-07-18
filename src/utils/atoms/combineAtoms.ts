import { createAtom } from '@reatom/core';
import type { Atom } from '@reatom/core';

type AtomsMap = { [key: string]: Atom<any> };

export function combineAtoms<T extends AtomsMap>(
  shape: T,
): Atom<{ [key in keyof T]: T[key] extends Atom<infer S> ? S : never }> {
  return createAtom(shape, ({ get }, state = {}) => {
    return Object.keys(shape).reduce((acc, key) => {
      // @ts-ignore
      acc[key] = get(key);
      return acc;
    }, {} as { [key in keyof T]: T[key] extends Atom<infer S> ? S : never });
  });
}
