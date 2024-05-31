import clsx from 'clsx';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState<boolean>();

  function onKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      onClick();
    }
  }

  return (
    <Tooltip placement="top" open={isOpen}>
      <TooltipTrigger asChild>
        <div
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onKeyUp={onKeyUp}
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
