import clsx from 'clsx';
import { SimpleTooltip } from '@konturio/floating';
import style from './LayerActionIcon.module.css';
import type { PropsWithChildren } from 'react';

interface LayerActionButtonProps {
  onClick: () => void;
  hint: string;
  className?: string;
}

export function LayerActionIcon({
  onClick,
  hint,
  children,
  className,
}: PropsWithChildren<LayerActionButtonProps>) {
  return (
    <SimpleTooltip content={hint} placement="top">
      <button className={clsx(style.actionButton, className)} onClick={onClick}>
        {children}
      </button>
    </SimpleTooltip>
  );
}
