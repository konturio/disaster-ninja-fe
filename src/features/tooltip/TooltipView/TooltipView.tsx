import clsx from 'clsx';
import s from './Tooltip.module.css';
import type { PropsWithChildren } from 'react';

export function TooltipView({
  anchor,
  corner,
  onClick,
  children,
}: PropsWithChildren<{
  anchor: {
    top: number;
    right: number;
  };
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}>) {
  return (
    <div
      className={s.tooltipAnchor}
      style={{
        top: anchor.top,
        right: anchor.right,
      }}
    >
      <div className={clsx(s.tooltip, s[corner])} onClick={onClick}>
        <div className={s.tooltipBody}>{children}</div>
      </div>
    </div>
  );
}
