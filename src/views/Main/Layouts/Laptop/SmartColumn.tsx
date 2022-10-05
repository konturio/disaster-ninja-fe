import { useRef, createContext, useContext, useLayoutEffect, useState } from 'react';
import s from './Laptop.module.css';
import type { MutableRefObject } from 'react';

type DynamicDivRef = MutableRefObject<null | HTMLDivElement>;
export type PanelMeta = {
  resizableNode: HTMLDivElement;
  closeCb: () => void;
  minHeight: number;
  getOpenState: () => boolean;
};

class CardsRepository {
  cards = new Set<PanelMeta>();

  add(card: PanelMeta) {
    this.cards.add(card);
    return () => this.remove(card);
  }

  remove(card: PanelMeta) {
    this.cards.delete(card);
  }

  closeCard(card: PanelMeta) {
    card.resizableNode.style.display = 'none'; // Prevent hide for remove flickering
    card.closeCb();
  }

  adjustToHeight(card: PanelMeta, desiredHeight: number) {
    const newHeight = desiredHeight >= card.minHeight ? desiredHeight : card.minHeight;
    card.resizableNode.style.height = newHeight + 'px';
  }

  /* Returns array with [card, cardHeight] entries */
  getCardsWithExtraSpace() {
    return Array.from(this.cards).reduce((acc: [PanelMeta, number][], c) => {
      const height = c.resizableNode.getBoundingClientRect().height;
      if (height > c.minHeight) {
        acc.push([c, height]);
      }
      return acc;
    }, []);
  }

  getCardsWithOpenState() {
    return Array.from(this.cards).filter((c) => c.getOpenState());
  }
}

export class Resizer {
  cards = new CardsRepository();
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
        const cardsWithExtraSpace = this.cards.getCardsWithExtraSpace();
        if (cardsWithExtraSpace.length > 0) {
          // Reduce cards height
          const reduceSize = Math.ceil(diff / cardsWithExtraSpace.length);
          cardsWithExtraSpace.forEach(([card, currentHeight]) => {
            this.cards.adjustToHeight(card, currentHeight - reduceSize);
          });
          // In case no children with extra space
        } else {
          // Close first opened card
          const openedCards = this.cards.getCardsWithOpenState();
          if (openedCards[0]) {
            this.cards.closeCard(openedCards[0]);
          } else {
            console.error('Not enough space for cards');
          }
        }
        // Restore observing
        resizeObserver.observe(this.column.current);
      }
    });
    resizeObserver.observe(this.column.current);
    this.destroy = () => resizeObserver.unobserve(this.column!.current!);
  }

  addCard(card: PanelMeta) {
    return this.cards.add(card);
  }

  destroy() {
    // TODO
  }
}

const ColumnContext = createContext<Resizer | string>('no provider was given');

export function useColumnContext() {
  return useContext(ColumnContext);
}

export function SmartColumn({ children }) {
  const columnRef = useRef<null | HTMLDivElement>(null);
  const limiterRef = useRef<null | HTMLDivElement>(null);

  const [resizer, setResizer] = useState<Resizer | null>(null);

  useLayoutEffect(() => {
    const resizer = new Resizer(columnRef, limiterRef);
    setResizer(resizer);
    return () => resizer.destroy();
  }, [setResizer]);
  return (
    <div className={s.smartColumn} ref={limiterRef}>
      <div className={s.smartColumnContent} ref={columnRef}>
        {resizer && (
          <ColumnContext.Provider value={resizer}>{children}</ColumnContext.Provider>
        )}
      </div>
    </div>
  );
}
