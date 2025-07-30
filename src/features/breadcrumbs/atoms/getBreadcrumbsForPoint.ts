import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type { LRUCache } from 'lru-cache';

export function getBreadcrumbsForPoint(
  cache: LRUCache<string | number, GeoJSON.Feature>,
  coords: [number, number],
): GeoJSON.Feature[] {
  const pt = point(coords);
  const matches: GeoJSON.Feature[] = [];
  cache.forEach((feature, key, cacheInstance) => {
    try {
      if (booleanPointInPolygon(pt, feature as any)) {
        cacheInstance.get(key); // mark feature as recently used
        matches.push(feature);
      }
    } catch {
      // ignore geometry errors
    }
  });
  return matches.sort(
    (a, b) => (b.properties?.admin_level ?? 0) - (a.properties?.admin_level ?? 0),
  );
}
