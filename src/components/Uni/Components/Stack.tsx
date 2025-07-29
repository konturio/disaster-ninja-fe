import React from 'react';
import clsx from 'clsx';
import s from './Stack.module.css';

export interface StackProps {
  children?: React.ReactNode;

  className?: string;

  style?: React.CSSProperties;
}

/**
 * Block component. Vertical layout
 */
export function Stack({ children, className, style }: StackProps) {
  return (
    <div className={clsx(s.stack, className)} style={{ ...style }}>
      {children}
    </div>
  );
}
