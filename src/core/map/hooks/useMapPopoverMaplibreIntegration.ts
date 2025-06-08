import { useCallback, useEffect, useMemo, useRef } from 'react';
import { DefaultMapPopoverPositionCalculator } from '../popover/MapPopoverPositionCalculator';
import {
  getMapContainerRect,
  pageToMapContainerCoords,
  mapContainerToPageCoords,
} from '../utils/maplibreCoordinateUtils';
import { useMapPositionTracker } from './useMapPositionTracker';
import type {
  MapPopoverService,
  ScreenPoint,
  MapPopoverPositionCalculator,
  RenderPopoverContentFn,
  IMapPopoverContentRegistry,
  MapClickContext,
  MapPopoverErrorHandler,
} from '../types';
import type { Map, MapMouseEvent } from 'maplibre-gl';

const defaultPositionCalculator = new DefaultMapPopoverPositionCalculator();

export interface UseMapPopoverMaplibreIntegrationOptions {
  map: Map | null;
  popoverService: MapPopoverService;
  renderContent?: RenderPopoverContentFn;
  registry?: IMapPopoverContentRegistry;
  positionCalculator?: MapPopoverPositionCalculator;
  enabled?: boolean;
  trackingDebounceMs?: number;
  onError?: MapPopoverErrorHandler;
}

/**
 * High-level hook that integrates Maplibre GL map click handling with popover service.
 * Handles all the boilerplate: click events, position tracking, service calls.
 * Reuses existing position tracking logic to eliminate duplication.
 */
export function useMapPopoverMaplibreIntegration(
  options: UseMapPopoverMaplibreIntegrationOptions,
) {
  const {
    map,
    popoverService,
    renderContent: providedRenderContent,
    registry,
    positionCalculator = defaultPositionCalculator,
    enabled = true,
    trackingDebounceMs = 16,
    onError,
  } = options;

  // Create renderContent function from registry if provided
  const renderContent = useMemo(() => {
    if (providedRenderContent) {
      return providedRenderContent;
    }

    if (registry) {
      return (context: MapClickContext) => {
        return registry.renderContent(context.originalEvent);
      };
    }

    return () => null;
  }, [providedRenderContent, registry]);

  // Store current values in refs to avoid useEffect dependency hell
  const mapRef = useRef(map);
  const popoverServiceRef = useRef(popoverService);
  const registryRef = useRef(registry);
  const renderContentRef = useRef(renderContent);
  const onErrorRef = useRef(onError);
  const enabledRef = useRef(enabled);

  // Update refs when values change
  mapRef.current = map;
  popoverServiceRef.current = popoverService;
  registryRef.current = registry;
  renderContentRef.current = renderContent;
  onErrorRef.current = onError;
  enabledRef.current = enabled;

  // Position tracking using existing hook with stable callback
  const handlePositionChange = useCallback(
    (point: ScreenPoint) => {
      const currentMap = mapRef.current;
      const currentService = popoverServiceRef.current;

      if (!currentMap || !currentService.isOpen()) return;

      try {
        // Use centralized coordinate utilities
        const containerRect = getMapContainerRect(currentMap);
        const containerPoint = pageToMapContainerCoords(point, containerRect);

        const { placement } = positionCalculator.calculate(
          containerRect,
          containerPoint.x,
          containerPoint.y,
        );
        currentService.updatePosition(point, placement);
      } catch (error) {
        console.error('Error updating popover position:', error);
      }
    },
    [positionCalculator],
  ); // Only depend on position calculator

  const positionTracker = useMapPositionTracker(map, {
    onPositionChange: handlePositionChange,
    debounceMs: trackingDebounceMs,
  });

  // Store position tracker in ref to avoid recreation issues
  const positionTrackerRef = useRef(positionTracker);
  positionTrackerRef.current = positionTracker;

  // Click handler using refs - no dependency hell
  const handleMapClickRef = useRef<(event: MapMouseEvent) => void>();
  handleMapClickRef.current = (event: MapMouseEvent) => {
    const currentMap = mapRef.current;
    const currentService = popoverServiceRef.current;
    const currentRegistry = registryRef.current;
    const currentRenderContent = renderContentRef.current;
    const currentOnError = onErrorRef.current;
    const currentTracker = positionTrackerRef.current;

    if (!currentMap) return;

    // Close existing popover
    if (currentService.isOpen()) {
      currentService.close();
      currentTracker.stopTracking();
    }

    let content: React.ReactNode;

    try {
      // Try registry-based content first
      if (currentRegistry) {
        const hasContent = currentService.showWithEvent(event);
        if (hasContent) {
          currentTracker.startTracking([event.lngLat.lng, event.lngLat.lat]);
          return;
        }
      }

      // Fallback to renderContent function
      if (currentRenderContent) {
        const context: MapClickContext = {
          map: currentMap,
          lngLat: event.lngLat,
          point: event.point, // Direct usage - no need for no-op conversion
          features: event.target.queryRenderedFeatures(event.point),
          originalEvent: event,
        };

        content = currentRenderContent(context);
      }
    } catch (error) {
      console.error('Error rendering popover content:', error);

      if (currentOnError) {
        const context: MapClickContext = {
          map: currentMap,
          lngLat: event.lngLat,
          point: event.point, // Direct usage - no need for no-op conversion
          features: event.target.queryRenderedFeatures(event.point),
          originalEvent: event,
        };
        content = currentOnError({ error: error as Error, context });
      } else {
        content = null;
      }
    }

    if (content) {
      // Direct utility usage instead of wrapper function
      const containerRect = getMapContainerRect(currentMap);
      const pagePoint = mapContainerToPageCoords(event.point, containerRect);

      currentService.showWithContent(pagePoint, content);
      currentTracker.startTracking([event.lngLat.lng, event.lngLat.lat]);
    }
  };

  // Direct click event binding with stable dependencies
  // Only bind when enabled=true (for simple maps)
  useEffect(() => {
    if (!map || !enabled) return;

    const clickHandler = (event: MapMouseEvent) => {
      handleMapClickRef.current?.(event);
    };

    map.on('click', clickHandler);
    return () => {
      map.off('click', clickHandler);
      positionTrackerRef.current?.stopTracking();
    };
  }, [map, enabled]); // Only depend on map and enabled flag

  const close = useCallback(() => {
    popoverService.close();
    positionTracker.stopTracking();
  }, [popoverService, positionTracker]);

  // Export stable click handler for priority systems
  const getHandleMapClick = useCallback(() => {
    return handleMapClickRef.current;
  }, []);

  return {
    close,
    handleMapClick: getHandleMapClick, // Export function, not the result
  };
}
