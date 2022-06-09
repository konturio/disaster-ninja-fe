import { createPrimitiveAtom, createAtom } from '~utils/atoms/createPrimitives';
import type { Feature, FeatureCollection } from 'geojson';

export const highlightedGeometry = createPrimitiveAtom<
  FeatureCollection | Feature
>({
  type: 'FeatureCollection',
  features: [],
});
