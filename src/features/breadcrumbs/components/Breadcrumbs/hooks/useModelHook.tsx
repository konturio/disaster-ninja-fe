import { useState, useLayoutEffect, useRef } from 'react';

interface UseModelProps<T> {
  items: T[];
  ellipsisWidth: number;
}

export const useModel = <T,>({ items, ellipsisWidth }: UseModelProps<T>) => {
  const [leftHiddenItemIndex, setLeftHiddenItemIndex] = useState<number | null>(null);
  const [rightHiddenItemIndex, setRightHiddenItemIndex] = useState<number | null>(null);
  const olRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    if (!olRef.current) return;

    const olComputedStyle = window.getComputedStyle(olRef.current);
    const paddingLeft = parseFloat(olComputedStyle.paddingLeft);
    const paddingRight = parseFloat(olComputedStyle.paddingRight);
    const containerWidth = olRef.current.offsetWidth - paddingLeft - paddingRight;
    const containerHeight = olRef.current.offsetHeight;
    // console.log({ containerWidth, containerHeight });
    // TODO: needs to adapt to size better
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
    olRef,
  };
};
