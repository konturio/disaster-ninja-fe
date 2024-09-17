import { useState, useLayoutEffect } from 'react';
import type { RefObject } from 'react';

interface UseModelProps<T> {
  items: T[];
  ellipsisWidth: number;
  containerRef: RefObject<HTMLElement>;
}

export const useHiddenItemsRange = <T,>({
  items,
  ellipsisWidth,
  containerRef,
}: UseModelProps<T>) => {
  const [leftHiddenItemIndex, setLeftHiddenItemIndex] = useState<number | null>(null);
  const [rightHiddenItemIndex, setRightHiddenItemIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const olComputedStyle = window.getComputedStyle(containerRef.current);
    const paddingLeft = parseFloat(olComputedStyle.paddingLeft);
    const paddingRight = parseFloat(olComputedStyle.paddingRight);
    const containerWidth = containerRef.current.offsetWidth - paddingLeft - paddingRight;
    const containerHeight = containerRef.current.offsetHeight;
    // TODO: needs to make it more adaptive
    if (containerHeight >= 40) {
      if (containerWidth > 600 && items.length >= 7) {
        setLeftHiddenItemIndex(2);
        setRightHiddenItemIndex(items.length - 3);
        return;
      }
      if (containerWidth <= 600 && items.length >= 6) {
        setLeftHiddenItemIndex(2);
        setRightHiddenItemIndex(items.length - 2);
        return;
      }
      if (containerWidth <= 500 && items.length >= 5) {
        setLeftHiddenItemIndex(1);
        setRightHiddenItemIndex(items.length - 2);
        return;
      }
    }

    setLeftHiddenItemIndex(null);
    setRightHiddenItemIndex(null);
  }, [ellipsisWidth, items]);

  return {
    leftHiddenItemIndex,
    rightHiddenItemIndex,
    olRef: containerRef,
  };
};
