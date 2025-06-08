import type { Map, MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';
import type { Placement } from '@floating-ui/react';

export type MapPagePoint = ScreenPoint & { __mapPagePoint: true };
export type MapContainerPoint = ScreenPoint & { __mapContainerPoint: true };

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface GeographicPoint {
  lng: number;
  lat: number;
}

export interface MapPopoverService {
  // Enhanced API for service-based delegation

  // Content-based API - parent determines when to show
  showWithContent: (
    point: MapPagePoint,
    content: React.ReactNode,
    options?: MapPopoverOptions,
  ) => void;

  // Registry-based API - parent passes map event, service determines content
  showWithEvent: (mapEvent: MapMouseEvent, options?: MapPopoverOptions) => boolean;

  // Position updates - parent tracks position, calls this
  updatePosition: (point: MapPagePoint, placement?: Placement) => void;

  // Simple control
  close: () => void;
  isOpen: () => boolean;

  // Legacy API methods for backward compatibility
  show: (point: MapPagePoint, content: React.ReactNode, placement?: Placement) => void;
  move: (point: MapPagePoint, placement?: Placement) => void;
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
  point: MapContainerPoint;
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
  point: MapContainerPoint;
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

export interface MapPopoverErrorInfo {
  error: Error;
  context: MapClickContext;
}

export type MapPopoverErrorHandler = (
  errorInfo: MapPopoverErrorInfo,
) => React.ReactNode | null;

export interface MapPopoverOptions {
  placement?: Placement;
  closeOnMove?: boolean;
  className?: string;
}

/**
 * Content provider interface for autonomous map popover content generation.
 * Each provider handles its own domain logic and returns content for the map popover.
 */
export interface IMapPopoverContentProvider {
  /**
   * Renders content for the map popover based on the click event.
   * @param mapEvent - The original MapLibre mouse event
   * @returns React content to display, or null if this provider doesn't handle this event
   */
  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null;

  /**
   * Optional: Returns popover display options for this provider's content.
   * @param mapEvent - The original MapLibre mouse event
   * @returns Options for how the popover should be displayed
   */
  getPopoverOptions?(mapEvent: MapMouseEvent): MapPopoverOptions;
}

/**
 * Registry interface for coordinating multiple content providers.
 */
export interface IMapPopoverContentRegistry {
  /**
   * Registers a content provider with the registry.
   */
  register(provider: IMapPopoverContentProvider): void;

  /**
   * Unregisters a content provider from the registry.
   */
  unregister(provider: IMapPopoverContentProvider): void;

  /**
   * Attempts to render content using registered providers.
   * @param mapEvent - The original MapLibre mouse event
   * @returns Content and options, or null if no provider can handle the event
   */
  renderContent(mapEvent: MapMouseEvent): {
    content: React.ReactNode;
    options?: MapPopoverOptions;
  } | null;
}
