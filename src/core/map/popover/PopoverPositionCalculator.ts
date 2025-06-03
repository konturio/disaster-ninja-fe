import type { PopoverPositionCalculator } from '../types';

interface PopoverPositionConfig {
  arrowWidth?: number;
  placementThreshold?: number;
  edgePadding?: number;
}

export class DefaultPopoverPositionCalculator implements PopoverPositionCalculator {
  private readonly config: Required<PopoverPositionConfig>;

  constructor(config: PopoverPositionConfig = {}) {
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
  ): { pageX: number; pageY: number; placement: string } {
    const placement = this.calculatePlacement(rect, rawX, rawY);
    const { clampedX, clampedY } = this.clampCoordinates(rect, rawX, rawY);

    return {
      pageX: rect.left + clampedX,
      pageY: rect.top + clampedY,
      placement,
    };
  }

  private calculatePlacement(rect: DOMRect, rawX: number, rawY: number): string {
    const { placementThreshold } = this.config;

    if (rawX < placementThreshold) return 'right';
    if (rawX > rect.width - placementThreshold) return 'left';
    if (rawY < placementThreshold) return 'bottom';
    if (rawY > rect.height - placementThreshold) return 'top';

    return 'top';
  }

  private clampCoordinates(
    rect: DOMRect,
    rawX: number,
    rawY: number,
  ): { clampedX: number; clampedY: number } {
    const { edgePadding } = this.config;

    return {
      clampedX: Math.min(Math.max(edgePadding, rawX), rect.width - edgePadding),
      clampedY: Math.min(Math.max(edgePadding, rawY), rect.height - edgePadding),
    };
  }
}
