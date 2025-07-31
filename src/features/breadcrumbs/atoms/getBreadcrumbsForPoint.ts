import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type { LRUCache } from 'lru-cache';

export function getBreadcrumbsForPoint(
  cache: LRUCache<string | number, GeoJSON.Feature>,
  coords: [number, number],
): GeoJSON.Feature[] {
  const pt = point(coords);
  const hits: [string | number, GeoJSON.Feature][] = [];

  for (const [k, f] of cache.entries()) {
    try {
      if (booleanPointInPolygon(pt, f as any)) hits.push([k, f]);
    } catch {
      // ignore geometry errors
    }
  }

  for (const [k] of hits) cache.get(k);

  return hits
    .map(([, f]) => f)
    .sort((a, b) => (b.properties?.admin_level ?? 0) - (a.properties?.admin_level ?? 0));
}
