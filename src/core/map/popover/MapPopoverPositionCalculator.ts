import {
  clampToContainerBounds,
  mapContainerToPageCoords,
} from '../utils/maplibreCoordinateUtils';
import type { MapPopoverPositionCalculator } from '../types';
import type { Placement } from '@floating-ui/react';

interface MapPopoverPositionConfig {
  arrowWidth?: number;
  placementThreshold?: number;
  edgePadding?: number;
}

export class DefaultMapPopoverPositionCalculator implements MapPopoverPositionCalculator {
  private readonly config: Required<MapPopoverPositionConfig>;

  constructor(config: MapPopoverPositionConfig = {}) {
    this.config = {
      arrowWidth: config.arrowWidth ?? 16,
      placementThreshold: config.placementThreshold ?? 16,
      edgePadding: config.edgePadding ?? 8,
    };
  }

  calculate(
    rect: DOMRect,
    rawX: number,
    rawY: number,
  ): { pageX: number; pageY: number; placement: Placement } {
    const placement = this.calculatePlacement(rect, rawX, rawY);

    const clampedPoint = clampToContainerBounds({ x: rawX, y: rawY }, rect, {
      edgePadding: this.config.edgePadding,
    });

    const pagePoint = mapContainerToPageCoords(clampedPoint, rect);

    return {
      pageX: pagePoint.x,
      pageY: pagePoint.y,
      placement,
    };
  }

  private calculatePlacement(rect: DOMRect, rawX: number, rawY: number): Placement {
    const { placementThreshold } = this.config;

    if (rawX < placementThreshold) return 'right';
    if (rawX > rect.width - placementThreshold) return 'left';
    if (rawY < placementThreshold) return 'bottom';
    if (rawY > rect.height - placementThreshold) return 'top';

    return 'top';
  }
}
