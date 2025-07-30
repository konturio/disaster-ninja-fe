import { useState, useRef, useCallback } from 'react';

export function useDraggablePosition(initial: { x: number; y: number }) {
  const [position, setPosition] = useState(initial);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const originRef = useRef(position);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      startRef.current = { x: e.clientX, y: e.clientY };
      originRef.current = position;

      const handleMove = (ev: PointerEvent) => {
        if (!startRef.current) return;
        const dx = ev.clientX - startRef.current.x;
        const dy = ev.clientY - startRef.current.y;
        setPosition({ x: originRef.current.x + dx, y: originRef.current.y + dy });
      };

      const handleUp = () => {
        startRef.current = null;
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [position],
  );

  return { position, onPointerDown };
}
