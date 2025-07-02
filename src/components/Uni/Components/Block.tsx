import React from 'react';
import clsx from 'clsx';
import s from './Block.module.css';

export interface BlockProps {
  children?: React.ReactNode;

  className?: string;

  style?: React.CSSProperties;
}

/**
 * Row component for horizontal layouts
 */
export function Block({ children, className, style }: BlockProps) {
  return (
    <div className={clsx(s.block, className)} style={{ ...style }}>
      {children}
    </div>
  );
}
