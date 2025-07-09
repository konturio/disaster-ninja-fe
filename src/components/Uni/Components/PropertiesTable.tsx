import clsx from 'clsx';
import s from './PropertiesTable.module.css';

export interface PropertiesTableProps {
  children?: React.ReactNode;

  className?: string;

  style?: React.CSSProperties;
}

/**
 * Container for displaying a vertical table of label-value pairs. Each child is a table row content (e.g. Field)
 */
export function PropertiesTable({ children, className, style }: PropertiesTableProps) {
  return (
    <div className={clsx(s.table, className)} style={{ ...style }}>
      {children}
    </div>
  );
}
