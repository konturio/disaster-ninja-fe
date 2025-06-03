import type { Map, MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface GeographicPoint {
  lng: number;
  lat: number;
}

export interface MapPopoverService {
  show: (point: ScreenPoint, content: React.ReactNode, placement?: string) => void;
  move: (point: ScreenPoint, placement?: string) => void;
  close: () => void;
}

export interface MapPositionTracker {
  startTracking: (lngLat: [number, number]) => void;
  stopTracking: () => void;
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

export interface PopoverPositionCalculator {
  calculate: (
    containerRect: DOMRect,
    rawX: number,
    rawY: number,
  ) => { pageX: number; pageY: number; placement: string };
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
 *
 * @param context - The {@link MapClickContext} object containing details about the map click event.
 * @returns A React.ReactNode to be displayed in the popover, or null/undefined if no popover should be shown.
 */
export type RenderPopoverContentFn = (
  context: MapClickContext,
) => React.ReactNode | null | undefined;
