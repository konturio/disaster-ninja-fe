import { useMemo, useEffect, useCallback } from 'react';
import { DefaultPopoverPositionCalculator } from '../popover/PopoverPositionCalculator';
import { MapPopoverController } from '../popover/MapPopoverController';
import { useMapPositionTracker } from './useMapPositionTracker';
import { useMapClickHandler } from './useMapClickHandler';
import type {
  MapPopoverService,
  ScreenPoint,
  PopoverPositionCalculator,
  RenderPopoverContentFn,
} from '../types';
import type { Map } from 'maplibre-gl';

export interface UseMapPopoverInteractionOptions {
  map: Map | null;
  popoverService: MapPopoverService;
  renderContent: RenderPopoverContentFn;
  positionCalculator?: PopoverPositionCalculator;
  enabled?: boolean;
  trackingDebounceMs?: number;
}

export function useMapPopoverInteraction(options: UseMapPopoverInteractionOptions) {
  const {
    map,
    popoverService,
    renderContent,
    positionCalculator: optionPositionCalculator,
    enabled = true,
    trackingDebounceMs = 16, // ~60fps
  } = options;

  const defaultPositionCalculator = useMemo(
    () => new DefaultPopoverPositionCalculator(),
    [],
  );
  const currentPositionCalculator = optionPositionCalculator ?? defaultPositionCalculator;

  const handlePositionChange = useCallback(
    (point: ScreenPoint) => {
      if (!map) return;
      const container = map.getContainer();
      const rect = container.getBoundingClientRect();

      const relativeX = point.x - rect.left;
      const relativeY = point.y - rect.top;

      const {
        pageX: newPageX,
        pageY: newPageY,
        placement: newPlacement,
      } = currentPositionCalculator.calculate(rect, relativeX, relativeY);

      popoverService.move({ x: newPageX, y: newPageY }, newPlacement);
    },
    [map, popoverService, currentPositionCalculator],
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
      positionCalculator: currentPositionCalculator,
      renderContent,
    });
  }, [map, popoverService, positionTracker, currentPositionCalculator, renderContent]);

  useMapClickHandler(map, {
    handler: controller || { handleClick: () => {} },
    enabled: enabled && !!controller,
  });

  useEffect(() => {
    return () => {
      controller?.close();
    };
  }, [controller]);

  return {
    close: () => controller?.close(),
  };
}
