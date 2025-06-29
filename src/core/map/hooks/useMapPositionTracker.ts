import { useRef, useCallback, useMemo } from 'react';
import { throttle } from '@github/mini-throttle';
import {
  clampToContainerBounds,
  mapContainerToPageCoords,
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

  const rawUpdate = useCallback(() => {
    if (!currentLngLatRef.current) return;

    const [lng, lat] = currentLngLatRef.current;

    try {
      const containerRect = containerRectManager.getRect();
      const projected = projectionFn([lng, lat]);
      const clamped = clampToContainerBounds(projected, containerRect, {
        clampToBounds: true,
      });
      const pagePoint = mapContainerToPageCoords(clamped, containerRect);

      onPositionChange({ x: pagePoint.x, y: pagePoint.y });
    } catch (error) {
      console.error('Error updating position:', error);
    }
  }, [onPositionChange, projectionFn, containerRectManager]);

  const updatePosition = useMemo(() => {
    return throttleMs > 0 ? throttle(rawUpdate, throttleMs) : rawUpdate;
  }, [rawUpdate, throttleMs]);

  const setCurrentPosition = useCallback(
    (lngLat: [number, number]) => {
      if (!isValidLngLatArray(lngLat)) {
        console.error(`Invalid coordinates for tracking: [${lngLat[0]}, ${lngLat[1]}]`);
        return;
      }

      currentLngLatRef.current = lngLat;
      updatePosition();
    },
    [updatePosition],
  );

  const clearPosition = useCallback(() => {
    currentLngLatRef.current = null;
  }, []);

  return {
    updatePosition,
    setCurrentPosition,
    clearPosition,
  };
}
