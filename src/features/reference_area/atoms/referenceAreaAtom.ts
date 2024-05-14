import { crc32 } from 'hash-wasm';
import { action, atom } from '@reatom/core';
import type { GeometryWithHash } from '~core/focused_geometry/types';

export const referenceAreaAtom = atom<GeometryWithHash | null>(
  null,
  '[Shared state] referenceAreaAtom',
);

export const setReferenceArea = action(async (ctx, geometry: GeometryWithHash) => {
  // need to add user to cache to be able to reference area invalidate cache on login/logout
  if (geometry) {
    const hash = await crc32(JSON.stringify({ geometry }));
    // update only in case if geometry source or hash has changed
    const referenceAreaOld = ctx.get(referenceAreaAtom);
    if (!referenceAreaOld || !referenceAreaOld.hash || referenceAreaOld.hash !== hash) {
      const geometryWithHash = { ...geometry, hash };
      referenceAreaAtom(ctx, geometryWithHash);
    }
  } else {
    referenceAreaAtom(ctx, null);
  }
});

export const reset = action(async (ctx) => {
  referenceAreaAtom(ctx, null);
});
