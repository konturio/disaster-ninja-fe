import { wrapLongitude } from './maplibreCoordinateUtils';
import type { Map } from 'maplibre-gl';

/**
 * Interface for pure coordinate projection functions.
 * Abstracts projection logic away from map instance dependencies.
 */
export interface IProjectionFunction {
  /**
   * Projects geographic coordinates to screen coordinates.
   * @param geographic Longitude and latitude coordinates
   * @returns Screen coordinates {x, y}
   */
  (geographic: [number, number]): { x: number; y: number };
}

/**
 * Adjusts longitude to match map's reference frame when viewport crosses antimeridian.
 * Handles cases where map bounds span the 180°/-180° line.
 */
function adjustLongitudeForMapBounds(lng: number, map: Map): number {
  const bounds = map.getBounds();
  const swLng = bounds.getSouthWest().lng;
  const neLng = bounds.getNorthEast().lng;

  // Check if map crosses antimeridian (bounds extend beyond ±180°)
  const crossesAntimeridian = neLng > 180 || swLng < -180 || swLng > neLng;

  // If map doesn't cross antimeridian, use standard wrapping
  if (!crossesAntimeridian) {
    return wrapLongitude(lng);
  }

  // Map crosses antimeridian - find which representation puts point in bounds
  const wrappedLng = wrapLongitude(lng);

  // Test if wrapped coordinate is already in bounds
  if (wrappedLng >= swLng && wrappedLng <= neLng) {
    return wrappedLng;
  }

  // Try adding 360 (for western hemisphere points on eastern-extended maps)
  const plus360 = wrappedLng + 360;
  if (plus360 >= swLng && plus360 <= neLng) {
    return plus360;
  }

  // Try subtracting 360 (for eastern hemisphere points on western-extended maps)
  const minus360 = wrappedLng - 360;
  if (minus360 >= swLng && minus360 <= neLng) {
    return minus360;
  }

  // Fallback to wrapped if no adjustment works
  return wrappedLng;
}

/**
 * Creates a MapLibre-specific projection function.
 * Wraps MapLibre's projection API in a pure function interface.
 */
export function createMapLibreProjection(map: Map): IProjectionFunction {
  return (coords: [number, number]) => {
    const adjustedLng = adjustLongitudeForMapBounds(coords[0], map);
    const adjustedCoords: [number, number] = [adjustedLng, coords[1]];
    const projected = map.project(adjustedCoords);

    return {
      x: projected.x,
      y: projected.y,
    };
  };
}
