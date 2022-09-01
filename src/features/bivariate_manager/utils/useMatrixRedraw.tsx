import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

type RedrawHandler = (left: number, top: number, right: number, bottom: number) => void;

let redrawHandler: RedrawHandler | undefined;

const setMatrixRedrawHandler = (handler: RedrawHandler) => {
  redrawHandler = handler;
};

const callMatrixRedrawHandler = (
  left: number,
  top: number,
  right: number,
  bottom: number,
) => {
  redrawHandler && redrawHandler(left, top, right, bottom);
};

export type RedrawContextType = [
  (left: number, top: number, right: number, bottom: number) => void,
  (handler: RedrawHandler) => void,
];

function debounce<F extends (...params: any[]) => void>(fn: F, delay: number) {
  let timeoutID = 0;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

export const MatrixRedrawContext = createContext<RedrawContextType>([
  callMatrixRedrawHandler,
  setMatrixRedrawHandler,
]);

export function useMatrixRedraw(containerRef: HTMLDivElement | null) {
  const [callMatrixRedraw] = useContext(MatrixRedrawContext);

  useEffect(() => {
    const resizeAndScrollHandler = debounce(() => {
      if (!containerRef || !callMatrixRedraw) return;
      const rect = containerRef.getBoundingClientRect();
      callMatrixRedraw(
        rect.left,
        rect.top,
        rect.left + rect.width,
        rect.top + rect.height,
      );
    }, 50);

    const ro = new ResizeObserver(resizeAndScrollHandler);

    if (containerRef) {
      containerRef.addEventListener('scroll', resizeAndScrollHandler);
      ro.observe(containerRef);
    }

    return () => {
      if (containerRef) {
        containerRef.removeEventListener('scroll', resizeAndScrollHandler);
        ro.disconnect();
      }
    };
  }, [containerRef]);
}

export function MatrixRedrawWrapper({ children }: { children: ReactNode }) {
  return (
    <MatrixRedrawContext.Provider
      value={[callMatrixRedrawHandler, setMatrixRedrawHandler]}
    >
      {children}
    </MatrixRedrawContext.Provider>
  );
}
