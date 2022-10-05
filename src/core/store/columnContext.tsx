import { useContext, createContext } from 'react';
import type { MutableRefObject } from 'react';

export const ColumnContext = createContext<Resizer | string>('no provider was given');

export function useColumnContext() {
  return useContext(ColumnContext);
}

type DynamicDivRef = MutableRefObject<null | HTMLDivElement>;

export type PanelMeta = {
  resizableNode: HTMLDivElement;
  closeCb: () => void;
  minHeight: number;
  getOpenState: () => boolean;
};

class PanelsRepository {
  panels = new Set<PanelMeta>();

  add(panel: PanelMeta) {
    this.panels.add(panel);
    return () => this.remove(panel);
  }

  remove(panel: PanelMeta) {
    this.panels.delete(panel);
  }

  closePanel(panel: PanelMeta) {
    panel.resizableNode.style.display = 'none'; // Prevent hide for remove flickering
    panel.closeCb();
  }

  adjustToHeight(panel: PanelMeta, desiredHeight: number) {
    const newHeight = desiredHeight >= panel.minHeight ? desiredHeight : panel.minHeight;
    panel.resizableNode.style.height = newHeight + 'px';
  }

  /* Returns array with [panel, panelHeight] entries */
  getPanelsWithExtraSpace() {
    return Array.from(this.panels).reduce((acc: [PanelMeta, number][], c) => {
      const height = c.resizableNode.getBoundingClientRect().height;
      if (height > c.minHeight) {
        acc.push([c, height]);
      }
      return acc;
    }, []);
  }

  getPanelsWithOpenState() {
    return Array.from(this.panels).filter((c) => c.getOpenState());
  }
}

export class Resizer {
  panels = new PanelsRepository();
  column: DynamicDivRef | null = null;
  public limiter: DynamicDivRef;

  constructor(columnRef: DynamicDivRef, limiterRef: DynamicDivRef) {
    this.column = columnRef;
    this.limiter = limiterRef;
    this.runSizeAdjuster();
  }

  getMaxColumnHeight() {
    if (!this.limiter.current) return null;
    return this.limiter.current.getBoundingClientRect().height;
  }

  runSizeAdjuster() {
    if (!this.column?.current)
      return console.warn('no element provided via ref', this.column?.current);
    const resizeObserver = new ResizeObserver((columnElements) => {
      const maxHeight = this.getMaxColumnHeight();
      if (!this.column?.current)
        return console.warn('no element provided via ref', this.column?.current);
      if (maxHeight === null)
        return console.warn('no element provided via ref', this.limiter.current);
      const column = columnElements[0]; // should always contain 1 element
      // Find how much space out of size
      const diff = column.contentRect.height - maxHeight;
      if (diff > 0) {
        // Stop observing while applying size changes
        resizeObserver.unobserve(this.column.current);
        // Get all children with height more than minimal
        const panelsWithExtraSpace = this.panels.getPanelsWithExtraSpace();
        if (panelsWithExtraSpace.length > 0) {
          // Reduce panels height
          const reduceSize = Math.ceil(diff / panelsWithExtraSpace.length);
          panelsWithExtraSpace.forEach(([panel, currentHeight]) => {
            this.panels.adjustToHeight(panel, currentHeight - reduceSize);
          });
          // In case no children with extra space
        } else {
          // Close first opened panel
          const openedPanels = this.panels.getPanelsWithOpenState();
          if (openedPanels[0]) {
            this.panels.closePanel(openedPanels[0]);
          } else {
            console.error('Not enough space for panels');
          }
        }
        // Restore observing
        resizeObserver.observe(this.column.current);
      }
    });
    resizeObserver.observe(this.column.current);
    this.destroy = () => resizeObserver.unobserve(this.column!.current!);
  }

  addPanel(panel: PanelMeta) {
    return this.panels.add(panel);
  }

  destroy() {
    // TODO
  }
}
