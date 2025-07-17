import clsx from 'clsx';
import s from './PropertyGrid.module.css';

export interface PropertyGridProps {
  children?: React.ReactNode;

  className?: string;

  style?: React.CSSProperties;
}

/**
 * Container for displaying a vertical table of label-value pairs. Each child is a table row content (e.g. Field)
 */
export function PropertyGrid({ children, className, style }: PropertyGridProps) {
  return (
    <div className={clsx(s.table, className)} style={{ ...style }}>
      {children}
    </div>
  );
}
