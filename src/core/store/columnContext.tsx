import { useContext, createContext } from 'react';
import type { MutableRefObject } from 'react';

export const ColumnContext = createContext<Resizer | null>(null);

export function useColumnContext() {
  return useContext(ColumnContext);
}

type DynamicDivRef = MutableRefObject<null | HTMLDivElement>;

export type PanelMeta = {
  resizableNode: HTMLDivElement;
  closeCb: () => void;
  minHeight: number;
  getOpenState: () => boolean;
  debug_caller?: string
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

    console.log('%c⧭ adjustToHeight', 'color: #99614d', panel.debug_caller, ...arguments);

    const newHeight = desiredHeight >= panel.minHeight ? desiredHeight : panel.minHeight;
    console.log('%c⧭ newHeight for ', 'color: #cc0036', panel.debug_caller, newHeight + ' of ' + panel.minHeight);
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
  public column: DynamicDivRef;
  public limiter: DynamicDivRef;
  cleanUpEffects = new Set<() => void>();

  constructor(columnRef: DynamicDivRef, limiterRef: DynamicDivRef) {
    this.column = columnRef;
    this.limiter = limiterRef;
    this.runSizeAdjuster();
  }

  getMaxColumnHeight() {
    const limiter = this.limiter.current;
    if (!limiter) return null;
    return limiter.getBoundingClientRect().height;
  }

  getContentHeight() {
    const column = this.column.current;
    if (!column) return null;
    return column.getBoundingClientRect().height;
  }

  runSizeAdjuster() {
    /* 1. Adjust size when card size changed */
    const columnEl = this.column.current;
    if (columnEl !== null) {
      const contentObserver = new ResizeObserver((columnElements) => {
        const column = columnElements[0]; // should always contain 1 element
        const maxHeight = this.getMaxColumnHeight();
        const contentHeight = column.contentRect.height;
        console.log('%c⧭ contentHeight', 'color: #514080', contentHeight);
        // Find how much space out of size
        const diff = maxHeight ? contentHeight - maxHeight : 0;
        if (diff > 0) {
          // Stop observing while applying size changes
          contentObserver.unobserve(columnEl);
          this._adjustPanelsHeight(diff);
          // Restore observing
          contentObserver.observe(columnEl);
        }
      });
      contentObserver.observe(columnEl);
      this.cleanUpEffects.add(() => contentObserver.unobserve(columnEl));
    } else {
      console.warn(
        '[ColumnContext]: Fail to adjust content size. Column ref not available',
      );
    }

    /* 2. Adjust size when column size changed (window resize) */
    const containerEl = this.limiter.current;
    if (containerEl !== null) {
      const containerObserver = new ResizeObserver((containerElements) => {
        const container = containerElements[0]; // should always contain 1 element
        const maxHeight = container.contentRect.height;
        const contentHeight = this.getContentHeight();
        // Find how much space out of size
        const diff = contentHeight ? contentHeight - maxHeight : 0;
        // diff can be for example 0.0093994140625
        if (diff > 0.1) {
          // Stop observing while apllying size changes
          containerObserver.unobserve(containerEl);
          this._adjustPanelsHeight(diff);
          // Restore observing
          containerObserver.observe(containerEl);
        }
      });
      containerObserver.observe(containerEl);
      this.cleanUpEffects.add(() => containerObserver.unobserve(containerEl));
    } else {
      console.warn(
        '[ColumnContext]: Fail to adjust container size. Container ref not available',
      );
    }
  }

  _adjustPanelsHeight(diff: number,) {
    // Get all children with height more than minimal
    const cardsWithExtraSpace = this.panels.getPanelsWithExtraSpace();
    console.log('%c⧭ cardsWithExtraSpace', 'color: #d0bfff', cardsWithExtraSpace);
    // solution 1:
    // check if resizing will help adjust to height. Panel can return how much space it can give away. Rely on that
    // if yes - resize panels. if no - start closing panels

    // solution 2:
    // after resize was done - start strething panels
    // things to make sure - stretching is limited by panel content
    // it will help remove 100vh from fullstate of event_list (and that resizing not breaking autoscroll)
    if (cardsWithExtraSpace.length > 0) {
      // Reduce cards height
      const reduceSize = Math.ceil(diff / cardsWithExtraSpace.length);
      console.log('%c⧭ from each column need to reduce ', 'color: #8c0038', reduceSize + 'px');
      cardsWithExtraSpace.forEach(([card, currentHeight]) => {
        this.panels.adjustToHeight(card, currentHeight - reduceSize);
      });
      // In case no children with extra space
    } else {
      // Close first opened card
      const openedPanels = this.panels.getPanelsWithOpenState();
      if (openedPanels[0]) {
        console.log('%c⧭ closing', 'color: #00736b', openedPanels[0].debug_caller, openedPanels[0]);
        this.panels.closePanel(openedPanels[0]);
      } else {
        console.error('Not enough space for cards');
      }
    }
  }

  addPanel(panel: PanelMeta) {
    return this.panels.add(panel);
  }

  destroy() {
    this.cleanUpEffects.forEach((effect) => {
      effect();
    });
  }
}
