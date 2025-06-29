import clsx from 'clsx';
import type { ReactNode } from 'react';
import s from './SmartColumn.module.css';

export function SmartColumn({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx(s.smartColumn, className)}>
      <div className={s.smartColumnContent}>{children}</div>
    </div>
  );
}
