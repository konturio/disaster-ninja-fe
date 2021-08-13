import React, { MouseEventHandler, ReactChild } from 'react';
import clsx from 'clsx';
import styles from './ActionButton.module.css';

interface ActionButtonProps {
  className?: string;
  children?: ReactChild | ReactChild[];
  onClick: MouseEventHandler<HTMLButtonElement>;
  type: 'action' | 'icon';
  hint?: string;
}

const ActionButton = ({
  className,
  children,
  onClick,
  type = 'action',
  hint,
}: ActionButtonProps) => (
  <button
    title={hint}
    onClick={onClick}
    type="button"
    className={clsx({
      [className || '']: className,
      [styles.buttonBase]: true,
      [styles.actionBtn]: type === 'action',
      [styles.iconBtn]: type === 'icon',
    })}
  >
    {children}
  </button>
);

export default ActionButton;
