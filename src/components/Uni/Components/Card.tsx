import React from 'react';
import clsx from 'clsx';
import s from './Card.module.css';

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  action?: string;
  handleAction?: (action: string, data?: any) => void;
}

/**
 * Card component that serves as a container with standardized styling
 * Uses the injected handleAction prop for click events
 */
export function Card({
  children,
  active,
  action,
  className,
  style,
  handleAction,
}: CardProps) {
  const handleClick = React.useCallback(() => {
    if (action && handleAction) {
      handleAction(action);
    }
  }, [action, handleAction]);

  return (
    <div
      className={clsx(s.card, active && s.selected, action && s.clickable, className)}
      style={style}
      onClick={action ? handleClick : undefined}
    >
      <div className={s.cardContent}>{children}</div>
    </div>
  );
}
