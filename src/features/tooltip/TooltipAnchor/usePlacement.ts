import { useEffect, useState } from 'react';
import type { PlacementFn, TooltipCoords, TooltipPlacement } from '../types';

export function usePlacement(
  getCorner: PlacementFn | TooltipPlacement,
  position: TooltipCoords,
) {
  const { x, y } = position;
  const [corner, setCorner] = useState<TooltipPlacement>(() =>
    typeof getCorner === 'function' ? getCorner({ x, y }) : getCorner,
  );

  useEffect(() => {
    if (typeof getCorner !== 'function') return;
    setCorner(getCorner({ x, y }));
  }, [getCorner, x, y]);

  return corner;
}
