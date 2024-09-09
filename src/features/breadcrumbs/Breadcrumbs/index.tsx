import cn from 'clsx';
import { ChevronRight16 } from '@konturio/default-icons';
import { Panel } from '@konturio/ui-kit';
import { BreadcrumbItem, Ellipsis, ellipsisWidth } from './components';
import styles from './style.module.css';
import { useModel } from './hooks/useModelHook';
import type { BreadcrumbBase } from './components';
import type { ReactNode } from 'react';

interface BreadcrumbsProps<T extends BreadcrumbBase> {
  items: T[];
  separator?: ReactNode;
  onClick: (value: string) => void;
  active?: string | null;
  classes?: {
    breadcrumbs: string;
  };
}

const Breadcrumbs = <T extends BreadcrumbBase>({
  items,
  separator = <ChevronRight16 />,
  active,
  onClick,
  classes,
}: BreadcrumbsProps<T>) => {
  const { leftHiddenItemIndex, rightHiddenItemIndex, olRef } = useModel({
    items,
    ellipsisWidth,
  });

  const renderItems = (start: number, end: number) => {
    return items
      .slice(start, end + 1)
      .map((crumb, index) => (
        <BreadcrumbItem
          key={start + index}
          label={crumb.label}
          value={crumb.value}
          active={active === crumb.value}
          onClick={onClick}
          separator={separator}
          isLastItem={start + index === items.length - 1}
        />
      ));
  };

  return (
    <nav aria-label="breadcrumb">
      <ol ref={olRef} className={cn(styles.breadcrumbs, classes?.breadcrumbs)}>
        {/* Render all items if no overflow */}
        {leftHiddenItemIndex === -1 && rightHiddenItemIndex === items.length ? (
          renderItems(0, items.length - 1)
        ) : (
          <>
            {renderItems(0, leftHiddenItemIndex - 1)}
            <Ellipsis
              items={items}
              leftHiddenItemIndex={leftHiddenItemIndex}
              rightHiddenItemIndex={rightHiddenItemIndex}
              separator={separator}
              onItemClick={onClick}
            />
            {renderItems(rightHiddenItemIndex, items.length - 1)}
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
