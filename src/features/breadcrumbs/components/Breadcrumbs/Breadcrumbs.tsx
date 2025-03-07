import cn from 'clsx';
import { ChevronRight16 } from '@konturio/default-icons';
import { useRef, type ReactNode } from 'react';
import { BreadcrumbItem, Ellipsis } from '..';
import styles from './Breadcrumbs.module.css';
import { useHiddenItemsRange } from './hooks/useHiddenItemsRange';
import type { BoundaryOption } from '~utils/map/boundaries';

interface BreadcrumbsProps {
  items: BoundaryOption[];
  separator?: ReactNode;
  onClick: (value: string | number) => void;
  classes?: {
    breadcrumbs: string;
  };
}

const Breadcrumbs = ({
  items,
  separator = <ChevronRight16 />,
  onClick,
  classes,
}: BreadcrumbsProps) => {
  const containerRef = useRef(null);
  const { leftHiddenItemIndex, rightHiddenItemIndex } = useHiddenItemsRange({
    items,
    containerRef,
  });

  const renderItems = (start: number, end: number) => {
    return items
      .slice(start, end + 1)
      .map((crumb, index) => (
        <BreadcrumbItem
          key={crumb.value}
          label={crumb.label}
          value={crumb.value}
          onClick={onClick}
          separator={separator}
          isLastItem={start + index === items.length - 1}
        />
      ));
  };

  return (
    <nav aria-label="breadcrumb" className={styles.nav}>
      <ol
        ref={containerRef}
        className={cn(styles.breadcrumbs, classes?.breadcrumbs, 'knt-breadcrumbs')}
      >
        {/* Render all items if no overflow */}
        {leftHiddenItemIndex === null || rightHiddenItemIndex === null ? (
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
