import type { MapMouseEvent } from 'maplibre-gl';
import type { ScreenPoint } from '../types';

export function mapContainerPointToPagePoint(
  mapContainerPoint: ScreenPoint,
  mapEventTarget: MapMouseEvent['target'],
): ScreenPoint {
  const container = mapEventTarget.getContainer();
  const rect = container.getBoundingClientRect();
  return {
    x: rect.left + mapContainerPoint.x,
    y: rect.top + mapContainerPoint.y,
  };
}

export function screenPointToMapContainerPoint(point: ScreenPoint): ScreenPoint {
  return point;
}
