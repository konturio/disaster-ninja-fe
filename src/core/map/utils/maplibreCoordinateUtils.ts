import type { Map } from 'maplibre-gl';
import type { MapMouseEvent } from 'maplibre-gl';
import type { ScreenPoint, GeographicPoint } from '../types';

/**
 * Represents different coordinate spaces in the MapLibre GL system.
 * This prevents mixing up coordinate systems at compile time.
 */
export interface MapContainerPoint extends ScreenPoint {
  readonly _mapContainer: unique symbol;
}

export interface PagePoint extends ScreenPoint {
  readonly _page: unique symbol;
}

export interface ProjectedPoint extends ScreenPoint {
  readonly _projected: unique symbol;
}

/**
 * Configuration for coordinate clamping operations.
 */
export interface ClampConfig {
  /** Minimum edge padding in pixels */
  edgePadding?: number;
  /** Whether to clamp to container bounds */
  clampToBounds?: boolean;
}

/**
 * Gets the bounding rectangle of a MapLibre GL map container.
 * Centralized to eliminate duplication across the codebase.
 */
export function getMapContainerRect(map: Map): DOMRect {
  const container = map.getContainer();
  return container.getBoundingClientRect();
}

/**
 * Wraps a longitude value to the range [-180, 180].
 */
export function wrapLongitude(lng: number): number {
  return ((((lng + 180) % 360) + 360) % 360) - 180;
}

/**
 * Projects geographic coordinates to screen coordinates using MapLibre GL.
 * Returns projected coordinates in the map's coordinate space.
 */
export function projectGeographicToScreen(
  map: Map,
  geographic: GeographicPoint | [number, number],
): ProjectedPoint {
  const coords = Array.isArray(geographic)
    ? geographic
    : [geographic.lng, geographic.lat];

  // Wrap longitude before projection
  const wrappedCoords: [number, number] = [wrapLongitude(coords[0]), coords[1]];
  const projected = map.project(wrappedCoords);

  return {
    x: projected.x,
    y: projected.y,
  } as ProjectedPoint;
}

/**
 * Clamps coordinates to container bounds with optional padding.
 * Prevents coordinates from going outside visible area.
 */
export function clampToContainerBounds(
  point: ScreenPoint,
  containerRect: DOMRect,
  config: ClampConfig = {},
): ScreenPoint {
  const { edgePadding = 0, clampToBounds = true } = config;

  if (!clampToBounds) {
    return point;
  }

  return {
    x: Math.min(Math.max(edgePadding, point.x), containerRect.width - edgePadding),
    y: Math.min(Math.max(edgePadding, point.y), containerRect.height - edgePadding),
  };
}

/**
 * Converts map container coordinates to page coordinates.
 * Adds the container's page offset to get absolute page position.
 */
export function mapContainerToPageCoords(
  containerPoint: ScreenPoint,
  containerRect: DOMRect,
): PagePoint {
  return {
    x: containerRect.left + containerPoint.x,
    y: containerRect.top + containerPoint.y,
  } as PagePoint;
}

/**
 * Converts page coordinates to map container relative coordinates.
 * Subtracts the container's page offset to get relative position.
 */
export function pageToMapContainerCoords(
  pagePoint: ScreenPoint,
  containerRect: DOMRect,
): MapContainerPoint {
  return {
    x: pagePoint.x - containerRect.left,
    y: pagePoint.y - containerRect.top,
  } as MapContainerPoint;
}

/**
 * High-level utility: Geographic coordinates to page coordinates.
 * Combines MapLibre projection, clamping, and coordinate space conversion.
 */
export function geographicToPageCoords(
  map: Map,
  geographic: GeographicPoint | [number, number],
  config: ClampConfig = {},
): PagePoint {
  const containerRect = getMapContainerRect(map);

  // Wrap longitude before processing
  let wrappedGeographic: [number, number];
  if (Array.isArray(geographic)) {
    wrappedGeographic = [wrapLongitude(geographic[0]), geographic[1]];
  } else {
    wrappedGeographic = [wrapLongitude(geographic.lng), geographic.lat];
  }

  const projected = projectGeographicToScreen(map, wrappedGeographic);
  const clamped = clampToContainerBounds(projected, containerRect, config);
  return mapContainerToPageCoords(clamped, containerRect);
}

/**
 * High-level utility: Geographic coordinates to clamped container coordinates.
 * Projects and clamps to container bounds without converting to page space.
 */
export function geographicToClampedContainerCoords(
  map: Map,
  geographic: GeographicPoint | [number, number],
  config: ClampConfig = {},
): MapContainerPoint {
  const containerRect = getMapContainerRect(map);
  const projected = projectGeographicToScreen(map, geographic);
  const clamped = clampToContainerBounds(projected, containerRect, config);

  return clamped as MapContainerPoint;
}
