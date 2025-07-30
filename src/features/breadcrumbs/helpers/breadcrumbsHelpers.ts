import { LngLatBounds } from 'maplibre-gl';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {
  type BboxPosition,
  type CenterZoomPosition,
} from '~core/shared_state/currentMapPosition';

export function getCenterFromPosition(
  position: BboxPosition | CenterZoomPosition,
): [number, number] {
  if (isBboxPosition(position)) {
    try {
      const bounds = new LngLatBounds(position.bbox);
      const center = bounds.getCenter();
      return center.toArray();
    } catch {
      throw new Error('Invalid position data provided');
    }
  } else {
    return [position.lng, position.lat];
  }
}

function isBboxPosition(
  position: BboxPosition | CenterZoomPosition,
): position is BboxPosition {
  return 'bbox' in position;
}

export function filterFeaturesContainingPoint(
  features: GeoJSON.Feature[],
  point: [number, number],
): GeoJSON.Feature[] {
  return features.filter((feature) => geometryContainsPoint(feature.geometry, point));
}

function geometryContainsPoint(
  geometry: GeoJSON.Geometry | null,
  point: [number, number],
): boolean {
  if (!geometry) return false;
  switch (geometry.type) {
    case 'Polygon':
    case 'MultiPolygon':
      return booleanPointInPolygon(point, geometry);
    case 'GeometryCollection':
      return geometry.geometries.some((g) => geometryContainsPoint(g, point));
    default:
      return false;
  }
}
