import { createAtom } from '@reatom/core';

type FocusedGeometry = GeoJSON.GeoJSON;

const defaultGeoJSON: FocusedGeometry = {
  type: 'FeatureCollection',
  features: [],
};

export const focusedGeometryAtom = createAtom(
  {
    setFocusedGeometry: (geometry: FocusedGeometry) => geometry,
  },
  ({ onAction }, state: FocusedGeometry | null = null) => {
    onAction('setFocusedGeometry', (geoJSON) => (state = geoJSON));
    return state;
  },
);
