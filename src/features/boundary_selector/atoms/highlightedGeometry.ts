import { atom } from '@reatom/framework';
import type { Feature, FeatureCollection } from 'geojson';

export const highlightedGeometryAtom = atom<FeatureCollection | Feature>(
  {
    type: 'FeatureCollection',
    features: [],
  },
  'highlightedGeometryAtom',
);
