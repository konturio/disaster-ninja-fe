import clsx from 'clsx';
import s from './Label.module.css';
import type { PropsWithChildren } from 'react';

interface LabelWithTooltipProps {
  className?: string;
}

export const Label = ({
  children,
  className,
}: PropsWithChildren<LabelWithTooltipProps>) => (
  <div className={clsx(s.tooltip, className)}>{children}</div>
);
