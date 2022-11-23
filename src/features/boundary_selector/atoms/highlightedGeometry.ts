import { createPrimitiveAtom, createAtom } from '~core/store/atoms/createPrimitives';
import type { Feature, FeatureCollection } from 'geojson';

export const highlightedGeometry = createPrimitiveAtom<
  FeatureCollection | Feature
>({
  type: 'FeatureCollection',
  features: [],
});
