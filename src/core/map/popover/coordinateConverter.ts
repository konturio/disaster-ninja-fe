import type { MapMouseEvent } from 'maplibre-gl';
import type { MapContainerPoint, MapPagePoint, ScreenPoint } from '../types';

export function mapContainerPointToPagePoint(
  mapContainerPoint: MapContainerPoint,
  mapEventTarget: MapMouseEvent['target'],
): MapPagePoint {
  const container = mapEventTarget.getContainer();
  const rect = container.getBoundingClientRect();
  const pageX = rect.left + mapContainerPoint.x;
  const pageY = rect.top + mapContainerPoint.y;
  return { x: pageX, y: pageY } as MapPagePoint;
}

export function screenPointToMapPagePoint(point: ScreenPoint): MapPagePoint {
  return point as MapPagePoint;
}

export function screenPointToMapContainerPoint(point: ScreenPoint): MapContainerPoint {
  return point as MapContainerPoint;
}
