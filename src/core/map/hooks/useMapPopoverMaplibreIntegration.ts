import { useCallback, useEffect, useRef, useMemo } from 'react';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { DefaultMapPopoverPositionCalculator } from '../popover/MapPopoverPositionCalculator';
import { pageToMapContainerCoords } from '../utils/maplibreCoordinateUtils';
import { MapContainerRectManager } from '../utils/containerRectManager';
import { createMapLibreProjection } from '../utils/projectionFunction';
import { useMapPositionTracker } from './useMapPositionTracker';
import type {
  MapPopoverService,
  ScreenPoint,
  MapPopoverPositionCalculator,
} from '../types';
import type { Map, MapMouseEvent } from 'maplibre-gl';

const defaultPositionCalculator = new DefaultMapPopoverPositionCalculator();

export interface UseMapPopoverMaplibreIntegrationOptions {
  map: Map;
  popoverService: MapPopoverService;
  positionCalculator?: MapPopoverPositionCalculator;
  enabled?: boolean;
  trackingThrottleMs?: number;
}

/**
 * High-level hook that integrates Maplibre GL map click handling with popover service.
 */
export function useMapPopoverMaplibreIntegration(
  options: UseMapPopoverMaplibreIntegrationOptions,
) {
  const {
    map,
    popoverService,
    positionCalculator = defaultPositionCalculator,
    enabled = true,
    trackingThrottleMs = 16,
  } = options;

  const unregisterMoveRef = useRef<(() => void) | null>(null);

  // Create managers once
  const containerRectManager = useMemo(
    () => new MapContainerRectManager(map.getContainer()),
    [map],
  );

  const projectionFn = useMemo(() => createMapLibreProjection(map), [map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      containerRectManager.dispose();
    };
  }, [containerRectManager]);

  const handlePositionChange = useCallback(
    (point: ScreenPoint) => {
      if (!popoverService.isOpen()) return;

      try {
        const containerRect = containerRectManager.getRect(); // Cached access
        const containerPoint = pageToMapContainerCoords(point, containerRect);

        const { placement } = positionCalculator.calculate(
          containerRect,
          containerPoint.x,
          containerPoint.y,
        );
        popoverService.updatePosition(point, placement);
      } catch (error) {
        console.error('Error updating popover position:', error);
      }
    },
    [popoverService, positionCalculator, containerRectManager],
  );

  const positionTracker = useMapPositionTracker({
    onPositionChange: handlePositionChange,
    throttleMs: trackingThrottleMs,
    projectionFn,
    containerRectManager,
  });

  const unregisterMoveListener = useCallback(() => {
    if (unregisterMoveRef.current) {
      unregisterMoveRef.current();
      unregisterMoveRef.current = null;
    }
  }, []);

  const startTracking = useCallback(
    (lngLat: [number, number]) => {
      // Stop any existing tracking
      unregisterMoveListener();

      // Start position tracking
      positionTracker.setCurrentPosition(lngLat);

      // Register move listener for position updates
      const handleMapMove = () => {
        positionTracker.updatePosition();
        return true; // Continue chain
      };

      unregisterMoveRef.current = registerMapListener('move', handleMapMove, 80);
    },
    [positionTracker, unregisterMoveListener],
  );

  const stopTracking = useCallback(() => {
    // Unregister move listener
    unregisterMoveListener();

    // Clear position tracker
    positionTracker.clearPosition();
  }, [positionTracker, unregisterMoveListener]);

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      const wasOpen = popoverService.isOpen();

      if (wasOpen) {
        popoverService.close();
      }

      try {
        const hasContent = popoverService.showWithEvent(event);

        if (hasContent) {
          // Start tracking for new popover
          startTracking([event.lngLat.lng, event.lngLat.lat]);
        } else if (wasOpen) {
          // Only stop tracking if we had a popover open but no new content
          stopTracking();
        }
      } catch (error) {
        console.error('Error rendering popover content:', error);
        // Stop tracking on error to prevent dangling listeners
        if (wasOpen) {
          stopTracking();
        }
      }

      return true; // Continue chain - allow other click listeners
    },
    [popoverService, startTracking],
  );

  // Register click event with priority system
  useEffect(() => {
    if (!enabled) return;

    const unregisterClick = registerMapListener('click', handleMapClick, 55);

    return () => {
      unregisterClick();
      stopTracking();
    };
  }, [enabled, handleMapClick]);

  const close = useCallback(() => {
    popoverService.close();
    stopTracking();
  }, [popoverService, stopTracking]);

  return {
    close,
    handleMapClick,
  };
}
