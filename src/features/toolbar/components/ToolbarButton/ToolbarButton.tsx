import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { forwardRef } from 'react';
import s from './ToolbarButton.module.css';
import type { ButtonProps } from '@konturio/ui-kit/tslib/Button';

// Control button component props
export interface ControlButttonProps {
  size: ButtonProps['size'];
  icon: React.ReactElement;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  variant?: ButtonProps['variant'];
  className?: string;
}

export const ToolbarButton = forwardRef(function ToolbarButton(
  {
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
    <Button
      ref={ref}
      variant={variant}
      iconBefore={icon}
      size={size}
      className={clsx(s[`toolbarButton_${size}`], className)}
      disabled={disabled}
      active={active}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});
