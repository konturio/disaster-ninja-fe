import { type ReactNode, useRef, useEffect } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  FloatingArrow,
} from '@floating-ui/react';
import s from './Floating.module.css';

// TODO: temporary solution for CornerTooltipWrapper, fix in Legend refactor
export function SimpleRefTooltip({
  referenceElement,
  content,
  isOpen,
  placement = 'top',
}: {
  referenceElement: HTMLElement | null;
  content: ReactNode;
  isOpen: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const arrowRef = useRef(null);
  const { x, y, strategy, refs, context } = useFloating({
    placement,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
  });

  // Set reference element when it changes
  useEffect(() => {
    if (referenceElement) {
      refs.setReference(referenceElement);
    }
  }, [referenceElement, refs]);

  if (!isOpen || !referenceElement) return null;

  return (
    <div
      className={s.tooltipContent}
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        zIndex: 'var(--tooltip)',
      }}
    >
      {content}
      <FloatingArrow
        ref={arrowRef}
        context={context}
        className={s.arrow}
        stroke="transparent"
        strokeWidth={2}
        height={8}
        width={16}
      />
    </div>
  );
}
