import { useCallback, useEffect, useRef } from 'react';
import { DefaultMapPopoverPositionCalculator } from '../popover/MapPopoverPositionCalculator';
import {
  getMapContainerRect,
  pageToMapContainerCoords,
} from '../utils/maplibreCoordinateUtils';
import { useMapPositionTracker } from './useMapPositionTracker';
import type {
  MapPopoverService,
  ScreenPoint,
  MapPopoverPositionCalculator,
} from '../types';
import type { Map, MapMouseEvent } from 'maplibre-gl';

const defaultPositionCalculator = new DefaultMapPopoverPositionCalculator();

export interface UseMapPopoverMaplibreIntegrationOptions {
  map: Map | null;
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

  const mapRef = useRef(map);
  const popoverServiceRef = useRef(popoverService);
  mapRef.current = map;
  popoverServiceRef.current = popoverService;

  const handlePositionChange = useCallback(
    (point: ScreenPoint) => {
      const currentMap = mapRef.current;
      const currentService = popoverServiceRef.current;

      if (!currentMap || !currentService.isOpen()) return;

      try {
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
  );

  const positionTracker = useMapPositionTracker(map, {
    onPositionChange: handlePositionChange,
    throttleMs: trackingThrottleMs,
  });

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      if (!map) return;

      if (popoverService.isOpen()) {
        popoverService.close();
        positionTracker.stopTracking();
      }

      try {
        const hasContent = popoverService.showWithEvent(event);
        if (hasContent) {
          positionTracker.startTracking([event.lngLat.lng, event.lngLat.lat]);
        }
      } catch (error) {
        console.error('Error rendering popover content:', error);
      }
    },
    [map, popoverService, positionTracker],
  );

  // Direct click event binding when enabled
  useEffect(() => {
    if (!map || !enabled) return;

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
      positionTracker.stopTracking();
    };
  }, [map, enabled, handleMapClick, positionTracker]);

  const close = useCallback(() => {
    popoverService.close();
    positionTracker.stopTracking();
  }, [popoverService, positionTracker]);

  return {
    close,
    handleMapClick,
  };
}
