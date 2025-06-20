import { useRef, useCallback, useMemo } from 'react';
import { throttle } from '@github/mini-throttle';
import {
  clampToContainerBounds,
  mapContainerToPageCoords,
  wrapLongitude,
} from '../utils/maplibreCoordinateUtils';
import { isValidLngLatArray } from '../utils/coordinateValidation';
import type { ScreenPoint } from '../types';
import type { IProjectionFunction } from '../utils/projectionFunction';
import type { IContainerRectManager } from '../utils/containerRectManager';

interface UseMapPositionTrackerOptions {
  onPositionChange: (point: ScreenPoint) => void;
  throttleMs?: number;
  projectionFn: IProjectionFunction;
  containerRectManager: IContainerRectManager;
}

interface MapPositionTracker {
  updatePosition: () => void;
  setCurrentPosition: (lngLat: [number, number]) => void;
  clearPosition: () => void;
}

export function useMapPositionTracker(
  options: UseMapPositionTrackerOptions,
): MapPositionTracker {
  const {
    onPositionChange,
    throttleMs = 0,
    projectionFn,
    containerRectManager,
  } = options;
  const currentLngLatRef = useRef<[number, number] | null>(null);
  const rafIdRef = useRef<number>();

  const throttledUpdatePosition = useMemo(() => {
    const rawUpdate = () => {
      if (!currentLngLatRef.current) return;

      const [lng, lat] = currentLngLatRef.current;

      try {
        const containerRect = containerRectManager.getRect();

        const projected = projectionFn([wrapLongitude(lng), lat]);

        const clamped = clampToContainerBounds(projected, containerRect, {
          clampToBounds: true,
        });
        const pagePoint = mapContainerToPageCoords(clamped, containerRect);

        onPositionChange({ x: pagePoint.x, y: pagePoint.y });
      } catch (error) {
        console.error('Error updating position:', error);
      }
    };

    if (throttleMs > 0) {
      return throttle(rawUpdate, throttleMs);
    }
    return rawUpdate;
  }, [onPositionChange, throttleMs, projectionFn, containerRectManager]);

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      throttledUpdatePosition();
    });
  }, [throttledUpdatePosition]);

  const updatePosition = useCallback(() => {
    if (!currentLngLatRef.current) return;

    if (throttleMs > 0) {
      throttledUpdatePosition();
    } else {
      scheduleUpdate();
    }
  }, [throttleMs, throttledUpdatePosition, scheduleUpdate]);

  const setCurrentPosition = useCallback(
    (lngLat: [number, number]) => {
      const wrappedLngLat: [number, number] = [wrapLongitude(lngLat[0]), lngLat[1]];

      if (!isValidLngLatArray(wrappedLngLat)) {
        console.error(
          `Invalid coordinates for tracking: [${wrappedLngLat[0]}, ${wrappedLngLat[1]}]`,
        );
        return;
      }

      currentLngLatRef.current = wrappedLngLat;

      // Trigger initial position update
      updatePosition();
    },
    [updatePosition],
  );

  const clearPosition = useCallback(() => {
    currentLngLatRef.current = null;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = undefined;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (typeof (throttledUpdatePosition as any).cancel === 'function') {
      (throttledUpdatePosition as any).cancel();
    }
    clearPosition();
  }, [throttledUpdatePosition, clearPosition]);

  return {
    updatePosition,
    setCurrentPosition,
    clearPosition: cleanup,
  };
}
