import { useCallback, useLayoutEffect, useEffect, useRef } from 'react';
import { useColumnContext } from '~core/store/columnContext';
import { savePanelHeight, loadPanelHeight } from '~core/panels_state';
import type { PanelMeta } from '~core/store/columnContext';
import type { SetStateAction } from 'react';

// Returns a callback that would handle element's height
export const useHeightResizer = (
  setIsOpen: (value: SetStateAction<boolean>) => void,
  isOpen: boolean,
  minHeight: number,
  panelId: string,
  noResize?: boolean,
  persistHeight?: boolean,
) => {
  const columnContext = useColumnContext();
  const openStateRef = useRef(isOpen);
  const cleanup = useRef<() => void>();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const persistedCustomHeight = useRef<string | null>(null);
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
      persistedCustomHeight.current = contentRef.current?.style.height || null;
      if (persistHeight && persistedCustomHeight.current) {
        savePanelHeight(panelId, persistedCustomHeight.current);
      }
    }
  }, [isOpen, panelId, persistHeight]);

  // Hackish way for update ref when it changed
  // It allow me re-apply listeners ant other staff after open-close action
  // Details: https://stackoverflow.com/questions/60476155/is-it-safe-to-use-ref-current-as-useeffects-dependency-when-ref-points-to-a-dom
  const handleRefChange = useCallback(
    (node: HTMLDivElement) => {
      contentRef.current = node;
      if (cleanup.current) cleanup.current();
      if (!columnContext) return;
      if (node) {
        if (persistHeight) {
          const storedHeight = loadPanelHeight(panelId);
          if (storedHeight) {
            node.style.height = storedHeight;
            persistedCustomHeight.current = storedHeight;
          }
        }
        const panel: PanelMeta = {
          resizableNode: node,
          closeCb: () => setIsOpen(false),
          minHeight,
          getOpenState: () => openStateRef.current,
          panelId,
          noResize,
        };
        // UseCallback not have cleanup like useEffect, this is workaround
        cleanup.current = columnContext.addPanel(panel);
      }
    },
    [columnContext, setIsOpen, minHeight, panelId, noResize, persistHeight],
  );

  useEffect(() => {
    if (!persistHeight || !contentRef.current) return;
    const node = contentRef.current;
    const observer = new ResizeObserver(() => {
      persistedCustomHeight.current =
        node.style.height || `${node.getBoundingClientRect().height}px`;
      savePanelHeight(panelId, persistedCustomHeight.current);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [persistHeight, panelId]);

  useEffect(() => {
    return () => {
      if (persistHeight && persistedCustomHeight.current) {
        savePanelHeight(panelId, persistedCustomHeight.current);
      }
    };
  }, [panelId, persistHeight]);

  return handleRefChange;
};
