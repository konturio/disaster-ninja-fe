import { useContext, createContext } from 'react';
import type { MutableRefObject } from 'react';

/** Context for managing column-based panel layouts */
export const ColumnContext = createContext<Resizer | null>(null);

/** Hook to access the column context */
export function useColumnContext() {
  return useContext(ColumnContext);
}

/** Reference to a div element that can be null */
type DynamicDivRef = MutableRefObject<null | HTMLDivElement>;

/**
 * Metadata for a resizable panel
 * @property resizableNode - The DOM element that can be resized
 * @property closeCb - Callback function to close the panel
 * @property minHeight - Minimum allowed height for the panel
 * @property getOpenState - Function to check if panel is open
 * @property panelId - Optional unique identifier for the panel
 * @property noResize - If true, panel will not be resized automatically
 */
export type PanelMeta = {
  resizableNode: HTMLDivElement;
  closeCb: () => void;
  minHeight: number;
  getOpenState: () => boolean;
  panelId?: string;
  noResize?: boolean;
};

/** Minimum size difference in pixels that triggers a resize */
const MIN_RESIZE_THRESHOLD = 2;

/** Repository to manage resizable panels and their states */
export class PanelsRepository {
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

  getPanelsWithExtraSpace(): [[PanelMeta, number, number][], number] {
    let totalExtraSpace = 0;
    const panelsWithSizes: [PanelMeta, number, number][] = [];

    this.panels.forEach((panel) => {
      if (panel.noResize) return;
      const height = panel.resizableNode.getBoundingClientRect().height;
      if (height > panel.minHeight) {
        const extraSpace = height - panel.minHeight;
        panelsWithSizes.push([panel, height, extraSpace]);
        totalExtraSpace += extraSpace;
      }
    });

    return [panelsWithSizes, totalExtraSpace];
  }

  getPanelsWithOpenState() {
    return Array.from(this.panels).filter((c) => c.getOpenState());
  }
}

/**
 * Manages dynamic resizing of panels within a column layout
 * Handles both panel-initiated and container-initiated size changes
 */
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

  /** Returns the maximum allowed height for the column based on limiter element */
  getMaxColumnHeight(): number | null {
    const limiter = this.limiter.current;
    if (!limiter) return null;
    return limiter.getBoundingClientRect().height;
  }

  /** Returns the current content height of the column */
  getContentHeight(): number | null {
    const column = this.column.current;
    if (!column) return null;
    return column.getBoundingClientRect().height;
  }

  /**
   * Sets up resize observers to handle dynamic size adjustments
   * Uses two observers:
   * 1. Content observer - handles changes in panel sizes
   * 2. Container observer - handles changes in available space (e.g., window resize)
   */
  runSizeAdjuster(): void {
    /**
     * Creates a resize handler that manages size adjustments
     * @param element - The element to observe
     * @param observer - The ResizeObserver instance
     * @param getDiff - Function to calculate size difference
     */
    const createResizeHandler = (
      element: Element,
      observer: ResizeObserver,
      getDiff: (entry: ResizeObserverEntry) => number,
    ) => {
      return (entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        const diff = getDiff(entry);
        if (diff > MIN_RESIZE_THRESHOLD) {
          observer.unobserve(element);
          this._adjustPanelsHeight(diff);
          observer.observe(element);
        }
      };
    };

    /* 1. Adjust size when panel content changes */
    const columnEl = this.column.current;
    if (columnEl !== null) {
      let contentObserver: ResizeObserver;
      const contentHandler = (entry: ResizeObserverEntry) => {
        const maxHeight = this.getMaxColumnHeight();
        return maxHeight ? entry.contentRect.height - maxHeight : 0;
      };

      // eslint-disable-next-line prefer-const
      contentObserver = new ResizeObserver(
        createResizeHandler(columnEl, contentObserver!, contentHandler),
      );

      contentObserver.observe(columnEl);
      this.cleanUpEffects.add(() => contentObserver.unobserve(columnEl));
    } else {
      console.warn(
        '[ColumnContext]: Fail to adjust content size. Column ref not available',
      );
    }

    /* 2. Adjust size when available space changes */
    const containerEl = this.limiter.current;
    if (containerEl !== null) {
      let containerObserver: ResizeObserver;
      const containerHandler = (entry: ResizeObserverEntry) => {
        const contentHeight = this.getContentHeight();
        return contentHeight ? contentHeight - entry.contentRect.height : 0;
      };

      // eslint-disable-next-line prefer-const
      containerObserver = new ResizeObserver(
        createResizeHandler(containerEl, containerObserver!, containerHandler),
      );

      containerObserver.observe(containerEl);
      this.cleanUpEffects.add(() => containerObserver.unobserve(containerEl));
    } else {
      console.warn(
        '[ColumnContext]: Fail to adjust container size. Container ref not available',
      );
    }
  }

  /**
   * Adjusts panel heights when space constraints change
   * Uses a two-phase approach:
   * 1. Try to resize panels proportionally if enough extra space exists
   * 2. If not enough space, close panels starting from the first open one
   * @param diff - The amount of space that needs to be adjusted
   */
  _adjustPanelsHeight(diff: number): void {
    const [cardsWithExtraSpace, totalExtraSpace] = this.panels.getPanelsWithExtraSpace();

    if (totalExtraSpace > diff) {
      let leftToReduce = diff;

      type HeightUpdate = readonly [PanelMeta, number];
      const heightUpdates: HeightUpdate[] = cardsWithExtraSpace
        .map(([card, currentHeight, availableExtraSpace]): HeightUpdate | null => {
          if (leftToReduce) {
            const reduceAmount =
              availableExtraSpace > leftToReduce ? leftToReduce : availableExtraSpace;
            leftToReduce = leftToReduce - reduceAmount;
            return [card, currentHeight - reduceAmount] as const;
          }
          return null;
        })
        .filter((update): update is HeightUpdate => update !== null);

      // Phase 2: Apply all height changes at once to minimize reflows
      heightUpdates.forEach(([card, newHeight]) => {
        this.panels.adjustToHeight(card, newHeight);
      });
    } else {
      // If resizing isn't enough, close panels
      const openedPanels = this.panels.getPanelsWithOpenState();
      if (openedPanels[0]) {
        this.panels.closePanel(openedPanels[0]);
      } else {
        console.debug('Not enough space for cards');
      }
    }
  }

  /**
   * Adds a new panel to be managed by the resizer
   * @returns Cleanup function to remove the panel
   */
  addPanel(panel: PanelMeta): () => void {
    return this.panels.add(panel);
  }

  /** Cleans up all observers and effects */
  destroy(): void {
    this.cleanUpEffects.forEach((effect) => {
      effect();
    });
  }
}
