import { useEffect } from 'react';

export function useWheelHorizontalScroll(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      if (node.scrollWidth <= node.clientWidth || e.deltaY === 0) return;
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [ref]);
}
