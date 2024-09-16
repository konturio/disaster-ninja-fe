import { useState, useLayoutEffect, useRef } from 'react';

interface UseModelProps<T> {
  items: T[];
  ellipsisWidth: number;
  activeIndex?: number | null;
}

export const useBreadcrumbItems = <T,>({
  items,
  ellipsisWidth,
  activeIndex,
}: UseModelProps<T>) => {
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const [leftHiddenItemIndex, setLeftHiddenItemIndex] = useState<number | null>(null);
  const [rightHiddenItemIndex, setRightHiddenItemIndex] = useState<number | null>(null);
  const olRef = useRef<HTMLOListElement>(null);

  const calculateWidths = () => {
    if (!olRef.current) throw new Error("Can't find ol element");

    const widths = Array.from(olRef.current.children).map(
      (child) => (child as HTMLElement).offsetWidth,
    );
    // console.log('calculate widths', widths);

    setItemWidths(widths);
    return widths;
  };

  useLayoutEffect(() => {
    // console.log('&&&&&&&&&& olRef?.current?.children changed');
    calculateWidths();
  }, [olRef?.current?.children, leftHiddenItemIndex]);

  useLayoutEffect(() => {
    const calculateBreadcrumbs = (itemWidths: number[]) => {
      if (!olRef.current || itemWidths.length === 0) return;

      const olComputedStyle = window.getComputedStyle(olRef.current);
      const paddingLeft = parseFloat(olComputedStyle.paddingLeft);
      const paddingRight = parseFloat(olComputedStyle.paddingRight);
      const containerWidth = olRef.current.clientWidth - paddingLeft - paddingRight;

      const totalWidth = itemWidths.reduce((acc, width) => acc + width, 0);

      let start = 0;
      let end = itemWidths.length - 1;

      let displayedWidth = itemWidths[end] + ellipsisWidth;
      // console.log('calculateBreadcrumbs', {
      //   totalWidth,
      //   displayedWidth,
      //   containerWidth,
      //   start,
      //   end,
      //   itemWidths,
      //   endW: itemWidths[end],
      // });

      while (start < end && displayedWidth <= containerWidth) {
        if (displayedWidth + itemWidths[start] <= containerWidth) {
          displayedWidth += itemWidths[start];
          start++;
          // console.log('loop:', `${start} - ${end}`, {displayedWidth});
        }
        if (start < end && displayedWidth + itemWidths[end - 1] <= containerWidth) {
          displayedWidth += itemWidths[end - 1];
          end--;
          // console.log('loop:', `${start} - ${end}`, {displayedWidth});
        } else {
          break;
        }
      }
      if (start !== end) {
        setLeftHiddenItemIndex(start);
        setRightHiddenItemIndex(end);
        // console.log('hidden:', { start, end });
      } else {
        setLeftHiddenItemIndex(null);
        setRightHiddenItemIndex(null);
      }
    };

    calculateBreadcrumbs(itemWidths);
    const observer = new ResizeObserver(() => {
      calculateBreadcrumbs(itemWidths);
    });

    if (olRef.current) {
      observer.observe(olRef.current);
    }

    return () => {
      if (olRef.current) {
        observer.unobserve(olRef.current);
      }
    };
  }, [ellipsisWidth, activeIndex, items, itemWidths]);

  return {
    leftHiddenItemIndex,
    rightHiddenItemIndex,
    olRef,
  };
};
