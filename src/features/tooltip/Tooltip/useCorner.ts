import { useEffect, useState } from 'react';
import type { CornerFn, TooltipCoords, TooltipCorner } from '../types';

export function useCorner(getCorner: CornerFn | TooltipCorner, position: TooltipCoords) {
  const { x, y } = position;
  const [corner, setCorner] = useState<TooltipCorner>(() =>
    typeof getCorner === 'function' ? getCorner({ x, y }) : getCorner,
  );

  useEffect(() => {
    if (typeof getCorner !== 'function') return;
    setCorner(getCorner({ x, y }));
  }, [getCorner, x, y]);

  return corner;
}
