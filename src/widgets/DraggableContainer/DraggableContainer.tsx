import { useDraggablePosition } from '~utils/hooks/useDraggablePosition';
import s from './DraggableContainer.module.css';
import type { ReactNode } from 'react';

export function DraggableContainer({
  children,
  initialX = 0,
  initialY = 0,
}: {
  children: ReactNode;
  initialX?: number;
  initialY?: number;
}) {
  const { position, onPointerDown } = useDraggablePosition({ x: initialX, y: initialY });

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('button')) return;
    onPointerDown(e);
  };

  return (
    <div
      className={s.container}
      style={{ left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  );
}
