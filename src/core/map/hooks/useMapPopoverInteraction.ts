import { useMemo, useEffect, useCallback } from 'react';
import { DefaultMapPopoverPositionCalculator } from '../popover/MapPopoverPositionCalculator';
import { MapPopoverController } from '../popover/MapPopoverController';
import { useMapPositionTracker } from './useMapPositionTracker';
import { useMapClickHandler } from './useMapClickHandler';
import type {
  MapPopoverService,
  ScreenPoint,
  MapPopoverPositionCalculator,
  RenderPopoverContentFn,
  MapPopoverErrorHandler,
} from '../types';
import type { Map } from 'maplibre-gl';

export interface UseMapPopoverInteractionOptions {
  map: Map | null;
  popoverService: MapPopoverService;
  renderContent: RenderPopoverContentFn;
  positionCalculator?: MapPopoverPositionCalculator;
  enabled?: boolean;
  trackingDebounceMs?: number;
  onError?: MapPopoverErrorHandler;
}

// Singleton position calculator to avoid recreating instances
const defaultPositionCalculator = new DefaultMapPopoverPositionCalculator();

export function useMapPopoverInteraction(options: UseMapPopoverInteractionOptions) {
  const {
    map,
    popoverService,
    renderContent,
    positionCalculator = defaultPositionCalculator,
    enabled = true,
    trackingDebounceMs = 16, // ~60fps
    onError,
  } = options;

  const handlePositionChange = useCallback(
    (point: ScreenPoint) => {
      if (!map) return;

      try {
        // The position tracker already gives us the correct page coordinates
        // We just need to calculate the placement based on the relative position within the map container
        const container = map.getContainer();
        const rect = container.getBoundingClientRect();

        const relativeX = point.x - rect.left;
        const relativeY = point.y - rect.top;

        const { placement } = positionCalculator.calculate(rect, relativeX, relativeY);

        // Use the point coordinates directly - they're already in page coordinates
        popoverService.move(point, placement);
      } catch (error) {
        console.error('Error updating popover position:', error);
      }
    },
    [map, popoverService, positionCalculator],
  );

  const positionTracker = useMapPositionTracker(map, {
    onPositionChange: handlePositionChange,
    debounceMs: trackingDebounceMs,
  });

  const controller = useMemo(() => {
    if (!map) return null;

    return new MapPopoverController({
      map,
      popoverService,
      positionTracker,
      positionCalculator,
      renderContent,
      onError,
    });
  }, [map, popoverService, positionTracker, positionCalculator, renderContent, onError]);

  useMapClickHandler(map, {
    handler: controller || { handleClick: () => {} },
    enabled: enabled && !!controller,
  });

  useEffect(() => {
    return () => {
      controller?.destroy();
    };
  }, [controller]);

  const close = useCallback(() => {
    controller?.close();
  }, [controller]);

  const destroy = useCallback(() => {
    controller?.destroy();
  }, [controller]);

  return {
    close,
    destroy,
    isDestroyed: false,
  };
}
