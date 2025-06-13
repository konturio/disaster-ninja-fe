import type { MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';
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
  // Enhanced API for service-based delegation

  // Content-based API - parent determines when to show
  showWithContent: (
    point: ScreenPoint,
    content: React.ReactNode,
    options?: MapPopoverOptions,
  ) => void;

  // Registry-based API - parent passes map event, service determines content
  showWithEvent: (mapEvent: MapMouseEvent, options?: MapPopoverOptions) => boolean;

  // Position updates - parent tracks position, calls this
  updatePosition: (point: ScreenPoint, placement?: Placement) => void;

  // Simple control
  close: () => void;
  isOpen: () => boolean;
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
   * @param onClose - Callback to close the popover (for interactive content)
   * @returns React content to display, or null if this provider doesn't handle this event
   */
  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null;
}

/**
 * Registry interface for coordinating multiple content providers.
 */
export interface IMapPopoverContentRegistry {
  /**
   * Registers a content provider with the registry using a unique ID.
   * @param id - Unique identifier for the provider
   * @param provider - The content provider instance
   */
  register(id: string, provider: IMapPopoverContentProvider): void;

  /**
   * Unregisters a content provider from the registry by ID.
   * @param id - Unique identifier of the provider to remove
   */
  unregister(id: string): void;

  /**
   * Attempts to render content using registered providers.
   * @param mapEvent - The original MapLibre mouse event
   * @param onClose - Callback to close the popover (for interactive content)
   * @returns Aggregated content from all providers, or null if no provider can handle the event
   */
  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null;
}
