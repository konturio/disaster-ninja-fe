import React from 'react';
import { Menu, MenuButton, MenuItem, MenuList } from '@konturio/ui-kit';
import commonStyles from '../commonStyles.module.css';
import styles from '../BreadcrumbItem/BreadcrumbItem.module.css';
import s from './Ellipsis.module.css';
import type { ReactNode } from 'react';
import type { BreadcrumbBase } from '../BreadcrumbItem/BreadcrumbItem';

// TODO: get rid of this hardcode and add ability to dynamically count width
export const ellipsis = '...';
export const ellipsisWidth = 35; // Approximate width of the `... >` element

interface EllipsisProps {
  items: BreadcrumbBase[];
  leftHiddenItemIndex: number;
  rightHiddenItemIndex: number;
  separator: ReactNode;
  onItemClick: (value: string) => void;
}

export const Ellipsis = React.memo(
  ({
    leftHiddenItemIndex,
    rightHiddenItemIndex,
    separator,
    items,
    onItemClick,
  }: EllipsisProps) => {
    if (leftHiddenItemIndex < rightHiddenItemIndex) {
      const hiddenItems = items.slice(leftHiddenItemIndex, rightHiddenItemIndex);
      return (
        <li className={styles.breadcrumbItem}>
          <Menu>
            <MenuButton>
              <div style={{ display: 'flex' }}>
                {ellipsis}
                <div className={commonStyles.separator}>{separator}</div>
              </div>
            </MenuButton>
            <MenuList classes={{ popover: s.popover }}>
              {hiddenItems.map((crumb) => (
                <MenuItem key={crumb.value} onSelect={() => onItemClick(crumb.value)}>
                  {crumb.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </li>
      );
    }
    return null;
  },
);

Ellipsis.displayName = 'Ellipsis';
