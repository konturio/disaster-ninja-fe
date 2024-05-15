import { crc32 } from 'hash-wasm';
import { action, atom } from '@reatom/core';
import { updateReferenceArea } from '~core/api/features';
import { FeatureFlag } from './featureFlags';
import type { GeometryWithHash } from '~core/focused_geometry/types';
import type { FeaturesConfig } from '~core/config/types';

export const referenceAreaAtom = atom<GeometryWithHash | null>(
  null,
  '[Shared state] referenceAreaAtom',
);

export const initReferenceArea = action((ctx, features: FeaturesConfig) => {
  // if there's a geometry in reference_area configuration - use it for initialization
  const refAreaGeometry =
    typeof features[FeatureFlag.REFERENCE_AREA] === 'object'
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (features[FeatureFlag.REFERENCE_AREA] as any).referenceAreaGeometry
      : null;
  if (
    refAreaGeometry?.type === 'FeatureCollection' ||
    refAreaGeometry?.type === 'Feature'
  ) {
    setReferenceArea(ctx, refAreaGeometry);
  }
});

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

export const resetReferenceArea = action(async (ctx) => {
  await updateReferenceArea(null);
  referenceAreaAtom(ctx, null);
});
