import { createAtom } from './createPrimitives';
import type { Atom, AtomBinded, AtomState } from '@reatom/core-v2';
import type { AsyncAtomState, AsyncAnyAtom } from './createAsyncAtom/types';

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

type AsyncAtomsMap = { [key: string]: AsyncAnyAtom<AtomBinded<any>> };
type CombinedAsyncAtomsState<T> = {
  loading: boolean;
  error:
    | {
        [key in keyof T]: T[key] extends AsyncAnyAtom<infer P, infer F>
          ? AtomState<T[key]>['error']
          : unknown;
      }
    | null;
  data: {
    [key in keyof T]: T[key] extends AsyncAnyAtom<infer P, infer F>
      ? AtomState<T[key]>['data']
      : unknown;
  };
  lastParams: {
    [key in keyof T]: T[key] extends AsyncAnyAtom<infer P, infer F>
      ? AtomState<T[key]>['lastParams']
      : unknown;
  };
  dirty: true;
};

export function combineAsyncAtoms<T extends AsyncAtomsMap>(shape: T) {
  return createAtom(shape, ({ get }): CombinedAsyncAtomsState<T> => {
    return Object.keys(shape).reduce(
      (acc, key: keyof T) => {
        const { loading, error, data, lastParams } = get(key) as AsyncAtomState<
          unknown,
          Record<string, unknown>
        >;
        if (loading) acc.loading = true;
        if (error) {
          if (acc.error === null) {
            // @ts-ignore
            acc.error = {
              [key]: error,
            } as Record<keyof T, string>;
          } else {
            // @ts-ignore
            acc.error[key] = error;
          }
        }
        // @ts-ignore
        acc.lastParams[key] = lastParams;
        // @ts-ignore
        acc.data[key] = data;

        return acc;
      },
      { dirty: true, data: {} } as unknown as CombinedAsyncAtomsState<T>,
    );
  });
}
