import { test, expect } from 'vitest';
// Override dispatchEvent to suppress map-related side effects during tests.
// This prevents crashes noted in TODO comments when Vitest triggers real events.
(globalThis as any).dispatchEvent = () => {};
import { polygon } from '@turf/helpers';
import { LRUCache } from 'lru-cache';
import { getBreadcrumbsForPoint } from './getBreadcrumbsForPoint';

const createPolygon = (coords: number[][]): GeoJSON.Polygon =>
  polygon([coords]).geometry as GeoJSON.Polygon;

test('getBreadcrumbsForPoint orders results by admin level', () => {
  const cache = new LRUCache<string | number, GeoJSON.Feature>({ max: 5 });
  const outer = {
    type: 'Feature' as const,
    id: 'outer',
    properties: { admin_level: 2, name: 'outer' },
    geometry: createPolygon([
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ]),
  };
  const inner = {
    type: 'Feature' as const,
    id: 'inner',
    properties: { admin_level: 4, name: 'inner' },
    geometry: createPolygon([
      [2, 2],
      [8, 2],
      [8, 8],
      [2, 8],
      [2, 2],
    ]),
  };
  cache.set(outer.id, outer);
  cache.set(inner.id, inner);

  const result = getBreadcrumbsForPoint(cache, [5, 5]);

  expect(
    result.map((f) => f.id),
    'inner admin boundary should be listed before outer',
  ).toEqual(['inner', 'outer']);
});

test('returns empty list with empty cache', () => {
  const cache = new LRUCache<string | number, GeoJSON.Feature>({ max: 5 });

  const result = getBreadcrumbsForPoint(cache, [0, 0]);

  expect(result.length, 'no features in cache should return empty list').toBe(0);
});

test('returns empty list when point is outside all polygons', () => {
  const cache = new LRUCache<string | number, GeoJSON.Feature>({ max: 5 });
  const feature = {
    type: 'Feature' as const,
    id: 'some',
    properties: { admin_level: 2, name: 'some' },
    geometry: createPolygon([
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ]),
  };
  cache.set(feature.id, feature);

  const result = getBreadcrumbsForPoint(cache, [20, 20]);

  expect(result.length, 'point outside polygon should yield no breadcrumbs').toBe(0);
});

test('handles features without admin_level property', () => {
  const cache = new LRUCache<string | number, GeoJSON.Feature>({ max: 5 });
  const outer = {
    type: 'Feature' as const,
    id: 'outer',
    properties: { admin_level: 2, name: 'outer' },
    geometry: createPolygon([
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ]),
  };
  const noLevel = {
    type: 'Feature' as const,
    id: 'noLevel',
    properties: { name: 'no level' },
    geometry: createPolygon([
      [2, 2],
      [8, 2],
      [8, 8],
      [2, 8],
      [2, 2],
    ]),
  } as GeoJSON.Feature;
  cache.set(outer.id, outer);
  cache.set(noLevel.id as string, noLevel);

  const result = getBreadcrumbsForPoint(cache, [5, 5]);

  expect(
    result.map((f) => f.id),
    'feature without admin_level should appear after feature with level',
  ).toEqual(['outer', 'noLevel']);
});

test('skips invalid geometries gracefully', () => {
  const cache = new LRUCache<string | number, GeoJSON.Feature>({ max: 5 });
  const valid = {
    type: 'Feature' as const,
    id: 'valid',
    properties: { admin_level: 2, name: 'valid' },
    geometry: createPolygon([
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ]),
  };
  const invalid = {
    type: 'Feature' as const,
    id: 'invalid',
    properties: { admin_level: 4, name: 'invalid' },
    geometry: { type: 'Polygon', coordinates: [] } as any,
  };
  cache.set(valid.id, valid);
  cache.set(invalid.id, invalid);

  const result = getBreadcrumbsForPoint(cache, [5, 5]);

  expect(
    result.map((f) => f.id),
    'invalid geometry should be skipped and not crash',
  ).toEqual(['valid']);
});
