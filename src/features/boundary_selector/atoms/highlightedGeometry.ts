import { Feature, FeatureCollection } from 'geojson';
import { createPrimitiveAtom, createAtom } from '~utils/atoms/createPrimitives';

export const highlightedGeometry = createPrimitiveAtom<
  FeatureCollection | Feature
>({
  type: 'FeatureCollection',
  features: [],
});
