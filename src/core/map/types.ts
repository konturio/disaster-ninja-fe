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

// Enhanced provider context for new architecture
export interface IMapPopoverProviderContext {
  getFeatures(): MapGeoJSONFeature[];
  getToolState(): { activeToolId?: string; isExclusive: boolean };
  getProviderInfo(): { priority: number; mode: 'exclusive' | 'shared'; id: string };
  mapEvent: MapMouseEvent;
  onClose: () => void;
}

// Provider priority constants
export const ProviderPriority = {
  CRITICAL: 1000, // System alerts, error states
  HIGH: 500, // Active tools (boundary selector, drawing)
  NORMAL: 100, // Layer interactions, tooltips
  LOW: 50, // Background info, debug data
  DEBUG: 1, // Development diagnostics
} as const;

/**
 * Enhanced content provider interface with context and priority support.
 * Providers receive shared resources through context to eliminate duplicate queries.
 */
export interface IMapPopoverContentProvider {
  /**
   * Renders content for the map popover using shared context.
   * @param context - Shared context with features, tool state, and provider info
   * @returns React content to display, or null if this provider doesn't handle this event
   */
  renderContent(context: IMapPopoverProviderContext): React.ReactNode | null;

  /**
   * Provider execution priority - higher numbers execute first.
   */
  readonly priority: number;

  /**
   * Whether this provider requires exclusive execution (no other providers run).
   */
  readonly isExclusive?: boolean;

  /**
   * Tool identifier for exclusive mode coordination.
   */
  readonly toolId?: string;
}

// Internal provider registration data
export interface ProviderRegistration {
  provider: IMapPopoverContentProvider;
  priority: number;
  registrationOrder: number;
  isActive: boolean;
  toolId?: string;
}

/**
 * Enhanced registry interface with coordination capabilities.
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
   * Attempts to render content using registered providers with coordination.
   * @param mapEvent - The original MapLibre mouse event
   * @param onClose - Callback to close the popover (for interactive content)
   * @returns Coordinated content from providers, or null if no provider can handle the event
   */
  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null;

  /**
   * Sets exclusive mode for a specific provider and tool.
   * @param providerId - ID of the provider to make exclusive
   * @param toolId - Optional tool identifier
   */
  setExclusiveMode(providerId: string, toolId?: string): void;

  /**
   * Clears exclusive mode, returning to normal priority-based execution.
   */
  clearExclusiveMode(): void;

  /**
   * Updates the current tool state for provider coordination.
   * @param toolState - Current tool state
   */
  updateToolState(toolState: { activeToolId?: string; isExclusive: boolean }): void;

  /**
   * Gets the current number of registered providers.
   */
  readonly providerCount: number;

  /**
   * Clears all registered providers.
   */
  clear(): void;

  /**
   * Sets a callback to close existing popovers when exclusive tools are activated.
   * @param callback - Function to call when popover should be closed, or null to remove
   */
  setCloseCallback(callback: (() => void) | null): void;
}
