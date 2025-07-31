import { Panel as UIKitPanel } from '@konturio/ui-kit';
import { forwardRef, useRef } from 'react';
import s from './styles.module.css';
import type { Panel as PanelProps } from '@konturio/ui-kit/tslib/Panel/types';

export const Panel = forwardRef<HTMLDivElement, PanelProps>((props, ref) => {
  const { resize = 'none', contentContainerRef, children, ...rest } = props;
  const internalRef = useRef<HTMLDivElement | null>(null);

  const handleContainerRef = (node: HTMLDivElement) => {
    internalRef.current = node;
    contentContainerRef?.(node);
  };

  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(0);

  const onMouseMove = (e: MouseEvent) => {
    if (startY.current === null || !internalRef.current) return;
    const diff = e.clientY - startY.current;
    const newHeight = startHeight.current + diff;
    internalRef.current.style.height = `${newHeight}px`;
  };

  const stopDrag = () => {
    startY.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDrag);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!internalRef.current) return;
    startY.current = e.clientY;
    startHeight.current = internalRef.current.getBoundingClientRect().height;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
    e.preventDefault();
  };

  return (
    <UIKitPanel
      {...rest}
      ref={ref}
      resize={resize}
      contentContainerRef={handleContainerRef}
    >
      {children}
      {resize === 'vertical' && (
        <div className={s.resizeHandle} onMouseDown={onMouseDown} />
      )}
    </UIKitPanel>
  );
});

Panel.displayName = 'Panel';
