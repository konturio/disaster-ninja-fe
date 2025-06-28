import { useCallback, useEffect, useRef, useMemo } from 'react';
import { type Map, type MapMouseEvent } from 'maplibre-gl';
import { DefaultMapPopoverPositionCalculator } from '../popover/MapPopoverPositionCalculator';
import {
  pageToMapContainerCoords,
  wrapLongitude,
} from '../utils/maplibreCoordinateUtils';
import { ContainerRectManager } from '../utils/containerRectManager';
import { createMapLibreProjection } from '../utils/projectionFunction';
import { useMapPositionTracker } from './useMapPositionTracker';
import type {
  MapPopoverService,
  ScreenPoint,
  MapPopoverPositionCalculator,
} from '../types';

const defaultPositionCalculator = new DefaultMapPopoverPositionCalculator();

export interface UseMapPopoverMaplibreIntegrationOptions {
  map: Map;
  popoverService: MapPopoverService;
  positionCalculator?: MapPopoverPositionCalculator;
  enabled?: boolean;
  trackingThrottleMs?: number;

  // Must provide BOTH or NEITHER
  eventHandlers?: {
    onClick: (handler: (event: MapMouseEvent) => boolean) => () => void;
    onMove: (handler: () => boolean) => () => void;
  };
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
    eventHandlers,
  } = options;

  const unregisterMoveRef = useRef<(() => void) | null>(null);

  // Create managers once
  const containerRectManager = useMemo(
    () => new ContainerRectManager(map.getContainer()),
    [map],
  );

  const projectionFn = useMemo(() => createMapLibreProjection(map), [map]);

  // Create default handlers for adhoc integration
  const defaultHandlers = useMemo(
    () => ({
      onClick: (handler: (event: MapMouseEvent) => boolean) => {
        map.on('click', handler);
        return () => map.off('click', handler);
      },
      onMove: (handler: () => boolean) => {
        map.on('move', handler);
        return () => map.off('move', handler);
      },
    }),
    [map],
  );

  const handlersRef = useRef(eventHandlers || defaultHandlers);
  if (eventHandlers !== undefined && handlersRef.current !== eventHandlers) {
    handlersRef.current = eventHandlers;
  } else if (eventHandlers === undefined && handlersRef.current !== defaultHandlers) {
    handlersRef.current = defaultHandlers;
  }

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
        const containerRect = containerRectManager.getRect();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerRectManager],
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

      unregisterMoveRef.current = handlersRef.current.onMove(handleMapMove);
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
        event.lngLat.lng = wrapLongitude(event.lngLat.lng);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Register click event
  useEffect(
    () => {
      if (!enabled) return;

      const unregisterClick = handlersRef.current.onClick(handleMapClick);

      return () => {
        unregisterClick();
        stopTracking();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled],
  );

  const close = useCallback(
    () => {
      popoverService.close();
      stopTracking();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    close,
    handleMapClick,
  };
}
