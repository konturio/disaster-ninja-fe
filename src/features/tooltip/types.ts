export type CornerFn = (coords: { x: number; y: number }) => TooltipCorner;
export type TooltipCoords = { x: number; y: number };
export type TooltipCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
