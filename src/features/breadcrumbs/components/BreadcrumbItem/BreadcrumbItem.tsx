import React from 'react';
import cn from 'clsx';
import { Text } from '@konturio/ui-kit';
import commonStyles from '../commonStyles.module.css';
import styles from './BreadcrumbItem.module.css';
import type { ReactNode } from 'react';

export interface BreadcrumbBase {
  label: string;
  value: string | number;
}

interface BreadcrumbItemProps extends BreadcrumbBase {
  active?: boolean;
  onClick: (value: string) => void;
  separator?: ReactNode;
  isLastItem?: boolean;
}

export const BreadcrumbItem = React.memo(
  ({
    label,
    value,
    active = false,
    onClick,
    separator,
    isLastItem = false,
  }: BreadcrumbItemProps) => {
    return (
      <li className={cn(styles.breadcrumbItem)}>
        <button
          type="button"
          className={cn(styles.button, { [styles.active]: active })}
          onClick={() => onClick(value.toString())}
        >
          <Text
            type="caption"
            className={cn(styles.breadcrumbLabel, { [styles.active]: active })}
          >
            {label}
          </Text>
        </button>
        {!isLastItem && <div className={commonStyles.separator}>{separator}</div>}
      </li>
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
