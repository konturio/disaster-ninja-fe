import { useState, useLayoutEffect, useRef } from 'react';

interface UseModelProps<T> {
  items: T[];
  ellipsisWidth: number;
}

export const useModel = <T,>({ items, ellipsisWidth }: UseModelProps<T>) => {
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const [leftHiddenItemIndex, setLeftHiddenItemIndex] = useState<number | null>(null);
  const [rightHiddenItemIndex, setRightHiddenItemIndex] = useState<number | null>(null);
  const olRef = useRef<HTMLOListElement>(null);

  // Cache all item widths before the first render
  useLayoutEffect(() => {
    if (!olRef.current) return;

    const widths = Array.from(olRef.current.children).map(
      (child) => (child as HTMLElement).offsetWidth,
    );
    setItemWidths(widths);
    setLeftHiddenItemIndex(null);
    setRightHiddenItemIndex(null);
  }, [items]);

  useLayoutEffect(() => {
    const calculateBreadcrumbs = () => {
      if (!olRef.current || itemWidths.length === 0) return;

      const olComputedStyle = window.getComputedStyle(olRef.current);
      const paddingLeft = parseFloat(olComputedStyle.paddingLeft);
      const paddingRight = parseFloat(olComputedStyle.paddingRight);
      const containerWidth = olRef.current.clientWidth - paddingLeft - paddingRight;

      const totalWidth = itemWidths.reduce((acc, width) => acc + width, 0);

      let start = 0;
      let end = itemWidths.length - 1;

      let displayedWidth = itemWidths[end] + ellipsisWidth;

      while (start < end && displayedWidth <= containerWidth) {
        if (displayedWidth + itemWidths[start] <= containerWidth) {
          displayedWidth += itemWidths[start];
          start++;
        }
        if (start < end && displayedWidth + itemWidths[end - 1] <= containerWidth) {
          displayedWidth += itemWidths[end - 1];
          end--;
        } else {
          break;
        }
      }
      if (start !== end) {
        setLeftHiddenItemIndex(start);
        setRightHiddenItemIndex(end);
      } else {
        setLeftHiddenItemIndex(null);
        setRightHiddenItemIndex(null);
      }
    };

    calculateBreadcrumbs();
    const observer = new ResizeObserver(() => {
      calculateBreadcrumbs();
    });

    if (olRef.current) {
      observer.observe(olRef.current);
    }

    return () => {
      if (olRef.current) {
        observer.unobserve(olRef.current);
      }
    };
  }, [ellipsisWidth, itemWidths, items, leftHiddenItemIndex, rightHiddenItemIndex]);

  return {
    leftHiddenItemIndex,
    rightHiddenItemIndex,
    olRef,
  };
};
