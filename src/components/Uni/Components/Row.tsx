import React from 'react';
import clsx from 'clsx';
import s from './Row.module.css';

export interface RowProps {
  children?: React.ReactNode;

  className?: string;

  style?: React.CSSProperties;

  wrap: boolean;
}

/**
 * Row component for horizontal layouts
 */
export function Row({ wrap = true, children, className, style }: RowProps) {
  return (
    <div
      className={clsx(s.row, className)}
      style={{ ...style, flexWrap: wrap ? 'wrap' : 'nowrap' }}
    >
      {children}
    </div>
  );
}
