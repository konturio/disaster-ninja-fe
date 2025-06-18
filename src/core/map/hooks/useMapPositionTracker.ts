import { useEffect, useRef, useCallback, useMemo } from 'react';
import { throttle } from '@github/mini-throttle';
import { geographicToPageCoords, wrapLongitude } from '../utils/maplibreCoordinateUtils';
import { isValidLngLatArray } from '../utils/coordinateValidation';
import type { Map } from 'maplibre-gl';
import type { ScreenPoint, MapPositionTracker } from '../types';

interface UseMapPositionTrackerOptions {
  onPositionChange: (point: ScreenPoint) => void;
  throttleMs?: number;
}

export function useMapPositionTracker(
  map: Map | null,
  options: UseMapPositionTrackerOptions,
): MapPositionTracker {
  const { onPositionChange, throttleMs = 0 } = options;
  const currentLngLatRef = useRef<[number, number] | null>(null);
  const rafIdRef = useRef<number>();

  const throttledUpdatePosition = useMemo(() => {
    const rawUpdate = () => {
      if (!map || !currentLngLatRef.current) return;

      const [lng, lat] = currentLngLatRef.current;

      try {
        const pagePoint = geographicToPageCoords(map, [lng, lat], {
          edgePadding: 0,
          clampToBounds: true,
        });

        onPositionChange({ x: pagePoint.x, y: pagePoint.y });
      } catch (error) {
        console.error('Error updating position:', error);
      }
    };

    if (throttleMs > 0) {
      return throttle(rawUpdate, throttleMs);
    }
    return rawUpdate;
  }, [map, onPositionChange, throttleMs]);

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      throttledUpdatePosition();
    });
  }, [throttledUpdatePosition]);

  const handleMapMove = useCallback(() => {
    if (!map || !currentLngLatRef.current) return;

    if (throttleMs > 0) {
      throttledUpdatePosition();
    } else {
      scheduleUpdate();
    }
  }, [map, throttleMs, throttledUpdatePosition, scheduleUpdate]);

  const startTracking = useCallback(
    (lngLat: [number, number]) => {
      if (!map) return;

      const wrappedLngLat: [number, number] = [wrapLongitude(lngLat[0]), lngLat[1]];

      if (!isValidLngLatArray(wrappedLngLat)) {
        console.error(
          `Invalid coordinates for tracking: [${wrappedLngLat[0]}, ${wrappedLngLat[1]}]`,
        );
        return;
      }

      if (currentLngLatRef.current) {
        map.off('move', handleMapMove);
      }

      currentLngLatRef.current = wrappedLngLat;
      map.on('move', handleMapMove);

      handleMapMove();
    },
    [map, handleMapMove],
  );

  const stopTracking = useCallback(() => {
    if (!map || !currentLngLatRef.current) return;

    map.off('move', handleMapMove);
    currentLngLatRef.current = null;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = undefined;
    }
  }, [map, handleMapMove]);

  const cleanup = useCallback(() => {
    if (typeof (throttledUpdatePosition as any).cancel === 'function') {
      (throttledUpdatePosition as any).cancel();
    }
  }, [throttledUpdatePosition]);

  useEffect(() => {
    return () => {
      cleanup();
      stopTracking();
    };
  }, [cleanup, stopTracking]);

  return {
    startTracking,
    stopTracking,
    cleanup,
  };
}
