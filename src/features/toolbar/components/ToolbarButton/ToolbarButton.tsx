import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import s from './ToolbarButton.module.css';
import type { ButtonProps } from '@konturio/ui-kit/tslib/Button';

// Control button component props
export interface ControlButttonProps {
  id?: string;
  size: ButtonProps['size'];
  icon: React.ReactElement;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  variant?: ButtonProps['variant'];
  className?: string;
}

export const ToolbarButton = forwardRef(function ToolbarButton(
  {
    id,
    icon,
    size,
    disabled,
    active,
    onClick,
    children,
    variant = 'invert-outline',
    className,
  }: React.PropsWithChildren<ControlButttonProps>,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant={variant}
          iconBefore={icon}
          size={size}
          className={clsx(s[`toolbarButton_${size}`], className, 'knt-toolbar-button')}
          disabled={disabled}
          active={active}
          onClick={onClick}
          data-testid={id}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
});
