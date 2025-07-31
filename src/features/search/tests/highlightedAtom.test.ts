import { createStore } from '@reatom/core-v2';
import { test, expect } from 'vitest';
import { searchHighlightedGeometryAtom } from '../atoms/highlightedGeometry';
import type { Feature, FeatureCollection } from 'geojson';

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

test('searchHighlightedGeometryAtom stores various geometry types', () => {
  const polygon: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    },
    properties: {},
  };
  searchHighlightedGeometryAtom(ctx, polygon);
  expect(ctx.get(searchHighlightedGeometryAtom)).toEqual(polygon);

  const line: Feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 1],
      ],
    },
    properties: {},
  };
  searchHighlightedGeometryAtom(ctx, line);
  expect(ctx.get(searchHighlightedGeometryAtom)).toEqual(line);
});

test('searchHighlightedGeometryAtom handles feature collections and empty geometries', () => {
  const polygon: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    },
    properties: {},
  };
  const line: Feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 1],
      ],
    },
    properties: {},
  };
  const fc: FeatureCollection = { type: 'FeatureCollection', features: [polygon, line] };
  searchHighlightedGeometryAtom(ctx, fc);
  expect(ctx.get(searchHighlightedGeometryAtom)).toEqual(fc);

  const emptyFc: FeatureCollection = { type: 'FeatureCollection', features: [] };
  searchHighlightedGeometryAtom(ctx, emptyFc);
  expect(ctx.get(searchHighlightedGeometryAtom)).toEqual(emptyFc);
});

test('searchHighlightedGeometryAtom accepts null values', () => {
  searchHighlightedGeometryAtom(ctx, null as unknown as Feature);
  expect(ctx.get(searchHighlightedGeometryAtom)).toBeNull();
});
