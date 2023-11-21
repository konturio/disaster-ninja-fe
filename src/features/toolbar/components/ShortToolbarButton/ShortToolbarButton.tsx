import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import s from './ShortToolbarButton.module.css';
import type { ControlButttonProps } from '../ToolbarButton/ToolbarButton';

export const ShortToolbarButton = forwardRef(function ToolbarButton(
  {
    icon,
    disabled,
    onClick,
    variant = 'invert',
    className,
    active,
    children,
  }: React.PropsWithoutRef<ControlButttonProps>,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant={variant}
          iconBefore={icon}
          size="tiny"
          className={clsx(className)}
          disabled={disabled}
          active={active}
          onClick={onClick}
        />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
});
