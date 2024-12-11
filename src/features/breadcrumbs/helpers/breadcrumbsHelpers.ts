import { LngLatBounds } from 'maplibre-gl';
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
