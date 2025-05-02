import clsx from 'clsx';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState<boolean>();

  function onKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      onClick();
    }
  }

  return (
    <SimpleTooltip content={hint} placement="top" open={isOpen} onOpenChange={setIsOpen}>
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
    </SimpleTooltip>
  );
}
