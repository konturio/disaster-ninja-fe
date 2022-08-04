import { isObject } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
import { createResourceFetcherAtom } from './createResourceFetcherAtom';
import type { Atom, AtomSelfBinded, AtomState } from '@reatom/core';
import type { ResourceAtomOptions, ResourceAtomState } from './types';

const voidCallback = () => null;

const defaultOptions: ResourceAtomOptions = {
  lazy: true,
  store: store,
};

export function createResourceAtom<
  F extends (params: AtomState<D>) => Promise<unknown>,
  D extends Atom<any>,
>(
  atom: D,
  fetcher: F,
  name: string,
  resourceAtomOptions?: ResourceAtomOptions,
): AtomSelfBinded<ResourceAtomState<F>>;
export function createResourceAtom<
  F extends (params: null) => Promise<any>,
  D = null,
>(
  atom: null,
  fetcher: F,
  name: string,
  resourceAtomOptions?: ResourceAtomOptions,
): AtomSelfBinded<ResourceAtomState<F>>;
export function createResourceAtom(
  atom: Atom<unknown> | null,
  fetcher: (params: AtomState<Atom<unknown>> | null) => Promise<unknown>,
  name: string,
  resourceAtomOptions?: ResourceAtomOptions,
): AtomSelfBinded<any> {
  const options = Object.assign(resourceAtomOptions ?? {}, defaultOptions);

  const resourceFetcherAtom = createResourceFetcherAtom<P, T>(fetcher, {
    name,
    store: options.store,
  });

  if (atom) {
    createAtom(
      { atom },
      ({ onChange, schedule }) => {
        onChange('atom', (newParams) => {
          schedule((dispatch) => {
            if (isObject(newParams)) {
              // Check states than we can be escalated
              if ('canceled' in newParams && newParams.canceled) {
                dispatch(resourceFetcherAtom.cancel(newParams as unknown as P));
                return;
              }
              if ('loading' in newParams && newParams.loading) {
                dispatch(resourceFetcherAtom.loading());
                return;
              }
              if ('error' in newParams && newParams.error !== null) {
                dispatch([
                  resourceFetcherAtom.error(newParams.error),
                  resourceFetcherAtom.finally(),
                ]);
                return;
              }
              if ('data' in newParams) {
                dispatch(resourceFetcherAtom.request(newParams.data));
                return;
              }
            }
            // If not, just pass data to fetcher
            dispatch(resourceFetcherAtom.request(newParams));
          });
        });
      },
      { store: options.store, id: `${name}-fetcher` },
      // instant activation
    ).subscribe(() => null);
  }

  if (!options.lazy) {
    // Start after core modules loaded
    setTimeout(() => {
      resourceFetcherAtom.subscribe(() => null);
    });
  }

  return resourceFetcherAtom;
}
