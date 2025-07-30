import { test, expect } from 'vitest';
import { polygon } from '@turf/helpers';
import { LRUCache } from 'lru-cache';
import { getBreadcrumbsForPoint } from './getBreadcrumbsForPoint';

const createPolygon = (coords: number[][]) => polygon([coords]).geometry as GeoJSON.Polygon;

test('getBreadcrumbsForPoint orders by admin level', () => {
  const cache = new LRUCache<string | number, GeoJSON.Feature>({ max: 5 });
  const outer = {
    type: 'Feature' as const,
    id: 'outer',
    properties: { admin_level: 2, name: 'outer' },
    geometry: createPolygon([
      [0,0], [10,0], [10,10], [0,10], [0,0],
    ]),
  };
  const inner = {
    type: 'Feature' as const,
    id: 'inner',
    properties: { admin_level: 4, name: 'inner' },
    geometry: createPolygon([
      [2,2], [8,2], [8,8], [2,8], [2,2],
    ]),
  };
  cache.set(outer.id, outer);
  cache.set(inner.id, inner);
  const result = getBreadcrumbsForPoint(cache, [5,5]);
  expect(result.map(f => f.id), 'inner should come before outer').toEqual(['inner','outer']);
});
