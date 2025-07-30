import { test, expect } from 'vitest';
(globalThis as any).dispatchEvent = () => {};
import { polygon } from '@turf/helpers';
import { LRUCache } from 'lru-cache';

const createPolygon = (coords: number[][]): GeoJSON.Polygon =>
  polygon([coords]).geometry as GeoJSON.Polygon;

test('getBreadcrumbsForPoint orders results by admin level', async () => {
  const { getBreadcrumbsForPoint } = await import('./breadcrumbsItemsAtom');
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
