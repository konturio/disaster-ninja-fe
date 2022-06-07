import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import s from './Label.module.css';

interface LabelWithTooltipProps {
  className?: string;
}

export const Label = ({
  children,
  className,
}: PropsWithChildren<LabelWithTooltipProps>) => (
  <div className={clsx(s.tooltip, className)}>{children}</div>
);
