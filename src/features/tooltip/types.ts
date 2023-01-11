export type PlacementFn = (coords: { x: number; y: number }) => TooltipPlacement;
export type TooltipCoords = { x: number; y: number };
export type TooltipPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
