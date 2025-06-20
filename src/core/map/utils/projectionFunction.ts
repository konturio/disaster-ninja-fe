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
 * Creates a MapLibre-specific projection function.
 * Wraps MapLibre's projection API in a pure function interface.
 */
export function createMapLibreProjection(map: Map): IProjectionFunction {
  return (coords: [number, number]) => {
    const wrappedCoords: [number, number] = [wrapLongitude(coords[0]), coords[1]];
    const projected = map.project(wrappedCoords);

    return {
      x: projected.x,
      y: projected.y,
    };
  };
}
