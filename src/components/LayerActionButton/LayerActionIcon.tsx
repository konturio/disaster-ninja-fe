import clsx from 'clsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import style from './LayerActionButton.module.css';
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
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <div
          className={clsx(style.actionButton, className)}
          onClick={onClick}
          tabIndex={0}
        >
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  );
}
