import { atom } from '@reatom/framework';
import type { Feature, FeatureCollection } from 'geojson';

export const searchHighlightedGeometryAtom = atom<FeatureCollection | Feature>(
  {
    type: 'FeatureCollection',
    features: [],
  },
  'searchHighlightedGeometryAtom',
);
