import clsx from 'clsx';
import s from './TooltipAnchor.module.css';
import { useCorner } from './useCorner';
import { findTooltipCorner } from './findTooltipCorner';
import type { PropsWithChildren } from 'react';
import type { CornerFn, TooltipCoords, TooltipCorner } from '../types';

export function TooltipAnchor({
  position,
  onClick,
  children,
  getCorner = findTooltipCorner,
}: PropsWithChildren<{
  position: TooltipCoords;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  getCorner?: TooltipCorner | CornerFn;
}>) {
  const corner = useCorner(getCorner, position);
  const top = position.y;
  const right = (globalThis.visualViewport?.width ?? 0) - position.x;

  return (
    <div className={s.tooltipAnchor} style={{ top, right }}>
      <div className={clsx(s.tooltip, s[corner])} onClick={onClick}>
        {children}
      </div>
    </div>
  );
}
