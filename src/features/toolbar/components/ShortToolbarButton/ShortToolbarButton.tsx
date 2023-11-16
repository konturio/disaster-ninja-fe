import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { forwardRef } from 'react';
import s from './ShortToolbarButton.module.css';
import type { ButtonProps } from '@konturio/ui-kit/tslib/Button';
import type { ControlButttonProps } from '../ToolbarButton/ToolbarButton';

export const ShortToolbarButton = forwardRef(function ToolbarButton(
  {
    icon,
    disabled,
    onClick,
    variant = 'invert',
    className,
    active,
  }: React.PropsWithoutRef<ControlButttonProps>,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
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
  );
});
