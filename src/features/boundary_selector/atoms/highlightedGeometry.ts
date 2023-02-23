import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import type { Feature, FeatureCollection } from 'geojson';

export const highlightedGeometryAtom = createPrimitiveAtom<FeatureCollection | Feature>(
  {
    type: 'FeatureCollection',
    features: [],
  },
  null,
  'highlightedGeometryAtom',
);
