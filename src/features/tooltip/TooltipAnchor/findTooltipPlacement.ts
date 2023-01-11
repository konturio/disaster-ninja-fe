import type { Coords, TooltipPlacement } from '~core/shared_state/currentTooltip';

export function findTooltipPlacement(clickPosition: Coords): TooltipPlacement {
  if (!globalThis.visualViewport) {
    console.warn('visualViewport not available, fallback value will be used');
    return 'top-left';
  }
  const { height, width } = globalThis.visualViewport;
  // click was on the bottom right side
  if (clickPosition.y > height / 2 && clickPosition.x > width / 2) return 'top-left';
  // click was on the bottom left side
  if (clickPosition.y > height / 2) return 'top-right';
  // click was on the top right side
  if (clickPosition.x > width / 2) return 'bottom-left';
  // click was on the top right side
  return 'bottom-right';
}
