import clsx from 'clsx';
import s from './TooltipAnchor.module.css';
import { usePlacement } from './usePlacement';
import { findTooltipPlacement } from './findTooltipPlacement';
import type { PropsWithChildren } from 'react';
import type { PlacementFn, TooltipCoords, TooltipPlacement } from '../types';

export function TooltipAnchor({
  position,
  onClick,
  children,
  getPlacement = findTooltipPlacement,
}: PropsWithChildren<{
  position: TooltipCoords;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  getPlacement?: TooltipPlacement | PlacementFn;
}>) {
  const corner = usePlacement(getPlacement, position);
  const width = globalThis.visualViewport?.width;
  const top = position.y;
  const right = width !== undefined ? width - position.x : 0;

  return (
    <div className={s.tooltipAnchor} style={{ top, right }}>
      <div className={clsx(s.tooltip, s[corner])} onClick={onClick}>
        {children}
      </div>
    </div>
  );
}
