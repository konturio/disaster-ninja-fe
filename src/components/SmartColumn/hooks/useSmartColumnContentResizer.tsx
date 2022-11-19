import { useCallback, useLayoutEffect, useEffect, useRef } from 'react';
import { useColumnContext } from './useColumnContext';
import type { SetStateAction } from 'react';
import type { PanelProps } from '../types';

// Returns a callback that would handle element's height
export const useSmartColumnContentResizer = (
  setIsOpen: (value: SetStateAction<boolean>) => void,
  isOpen: boolean,
  minHeight: number,
) => {
  const openStateRef = useRef(isOpen);
  const cleanup = useRef<() => void>();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const persistedCustomHeight = useRef<string | null>(null);
  const resizer = useColumnContext();
  /* Restore custom size */
  useLayoutEffect(() => {
    if (contentRef.current && persistedCustomHeight.current) {
      contentRef.current.style.height = persistedCustomHeight.current || 'auto';
    }
  }, [isOpen]);

  /* Resizable */
  useEffect(() => {
    openStateRef.current = isOpen;
    if (isOpen) {
      /* Save custom size */
      persistedCustomHeight.current = contentRef.current!.style.height;
    }
  }, [isOpen]);

  // Hackish way for update ref when it changed
  // It allow me re-apply listeners ant other staff after open-close action
  // Details: https://stackoverflow.com/questions/60476155/is-it-safe-to-use-ref-current-as-useeffects-dependency-when-ref-points-to-a-dom
  const handleRefChange = useCallback(
    (node: HTMLDivElement) => {
      contentRef.current = node;
      if (cleanup.current) cleanup.current();
      if (!resizer) return;
      if (node) {
        const panel: PanelProps = {
          resizableNode: node,
          closeCb: () => setIsOpen(false),
          minHeight,
          getOpenState: () => openStateRef.current,
        };
        // UseCallback not have cleanup like useEffect, this is workaround
        cleanup.current = resizer.addPanel(panel);
      }
    },
    [resizer, setIsOpen, minHeight],
  );

  return handleRefChange;
};
