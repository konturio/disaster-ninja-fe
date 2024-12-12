import { crc32 } from 'hash-wasm';
import { action, atom } from '@reatom/framework';
import { updateReferenceArea } from '~core/api/features';
import { configRepo } from '~core/config';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { AppFeature } from '~core/app/types';
import type { GeometryWithHash } from '~core/focused_geometry/types';

export const referenceAreaAtom = atom<GeometryWithHash | null>(
  getReferenceAreaFromConfigRepo(),
  '[Shared state] referenceAreaAtom',
);

function getReferenceAreaFromConfigRepo(): GeometryWithHash | null {
  const features = configRepo.get().features;
  // if there's a geometry in reference_area configuration - use it for initialization
  const refAreaGeometry =
    features[AppFeature.REFERENCE_AREA] &&
    typeof features[AppFeature.REFERENCE_AREA] === 'object'
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (features[AppFeature.REFERENCE_AREA] as any).referenceAreaGeometry
      : null;
  if (
    refAreaGeometry?.type === 'FeatureCollection' ||
    refAreaGeometry?.type === 'Feature'
  ) {
    return refAreaGeometry as GeometryWithHash;
  }
  return null;
}

export const setReferenceArea = action(async (ctx, geometry: GeometryWithHash) => {
  if (geometry) {
    dispatchMetricsEvent('ref_area');
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
}, 'setReferenceArea');

export const resetReferenceArea = action(async (ctx) => {
  await updateReferenceArea(null);
  referenceAreaAtom(ctx, null);
}, 'resetReferenceArea');
