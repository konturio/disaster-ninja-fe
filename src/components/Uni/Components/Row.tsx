import React from 'react';
import s from './Row.module.css';

export interface RowProps {
  children?: React.ReactNode;

  className?: string;

  style?: React.CSSProperties;
}

/**
 * Row component for horizontal layouts
 */
export function Row({ children, className, style }: RowProps) {
  return (
    <div className={`${s.row} ${className || ''}`} style={style}>
      {children}
    </div>
  );
}
