import type { Map, MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';
import type { Placement } from '@floating-ui/react';

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface GeographicPoint {
  lng: number;
  lat: number;
}

export interface MapPopoverService {
  show: (point: ScreenPoint, content: React.ReactNode, placement?: Placement) => void;
  move: (point: ScreenPoint, placement?: Placement) => void;
  close: () => void;
}

export interface MapPositionTracker {
  startTracking: (lngLat: [number, number]) => void;
  stopTracking: () => void;
  cleanup: () => void;
}

export interface MapClickHandler<T = MapGeoJSONFeature> {
  handleClick: (event: MapClickEvent<T>) => void;
}

export interface MapClickEvent<T = MapGeoJSONFeature> {
  point: ScreenPoint;
  lngLat: GeographicPoint;
  features: T[];
  originalEvent: MapMouseEvent;
}

export interface MapPopoverPositionCalculator {
  calculate: (
    containerRect: DOMRect,
    rawX: number,
    rawY: number,
  ) => { pageX: number; pageY: number; placement: Placement };
}

/**
 * Contextual information about a map click event.
 * This data is passed to the renderContent callback of the useMapPopoverInteraction hook.
 */
export interface MapClickContext {
  /** The MapLibre map instance where the click occurred. */
  map: Map;
  /** The geographic coordinates (longitude, latitude) of the click. */
  lngLat: GeographicPoint;
  /** The screen pixel coordinates of the click relative to the map container. */
  point: ScreenPoint;
  /** Optional array of map features found at the click location. */
  features?: MapGeoJSONFeature[];
  /** The original MapLibre mouse event. */
  originalEvent: MapMouseEvent;
}

/**
 * A callback function responsible for rendering the content of a map popover.
 * Wrapped in error boundary internally to prevent crashes.
 */
export type RenderPopoverContentFn = (
  context: MapClickContext,
) => React.ReactNode | null | undefined;

// Error handling types
export interface MapPopoverErrorInfo {
  error: Error;
  context: MapClickContext;
}

export type MapPopoverErrorHandler = (
  errorInfo: MapPopoverErrorInfo,
) => React.ReactNode | null;
