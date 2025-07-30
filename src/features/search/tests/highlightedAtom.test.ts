import { searchHighlightedGeometryAtom } from '../atoms/highlightedGeometry';
import { createStore } from '@reatom/core-v2';
import { test, expect } from 'vitest';
import type { Feature } from 'geojson';

const store = createStore();

const ctx = store.v3ctx;

test('searchHighlightedGeometryAtom stores highlighted geometry', () => {
  expect(ctx.get(searchHighlightedGeometryAtom)).toEqual({
    type: 'FeatureCollection',
    features: [],
  });
  const geom: Feature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: {},
  };
  searchHighlightedGeometryAtom(ctx, geom);
  expect(ctx.get(searchHighlightedGeometryAtom)).toEqual(geom);
});
