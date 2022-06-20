import { forwardRef, useImperativeHandle, useRef } from 'react';
import cn from 'clsx';
import styles from './BivariateMatrixCellConnector.module.css';

interface BivariateMatrixCellConnectorProps {
  type: 'horizontal' | 'vertical';
  style?: Record<string, any>;
}

export const BivariateMatrixCellConnector = forwardRef(
  ({ type, style }: BivariateMatrixCellConnectorProps, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    let isHovered = false;
    let isSelected = false;
    const baseClassNames = '';

    function generateClassNames(): string {
      return `${baseClassNames} ${cn({
        [styles.hovered]: isHovered,
        [styles.selected]: isSelected,
      })}`;
    }

    useImperativeHandle(ref, () => ({
      setHovered: () => {
        if (containerRef.current) {
          isHovered = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetHovered: () => {
        if (containerRef.current) {
          isHovered = false;
          containerRef.current.className = generateClassNames();
        }
      },
      setSelectedCol: () => {
        if (type === 'vertical' && containerRef.current) {
          isSelected = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedCol: () => {
        if (type === 'vertical' && containerRef.current) {
          isSelected = false;
          containerRef.current.className = generateClassNames();
        }
      },
      setSelectedRow: () => {
        if (type === 'horizontal' && containerRef.current) {
          isSelected = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedRow: () => {
        if (type === 'horizontal' && containerRef.current) {
          isSelected = false;
          containerRef.current.className = generateClassNames();
        }
      },
    }));

    return (
      <div
        className={
          type === 'horizontal' ? styles.horConnector : styles.vertConnector
        }
        style={style}
      >
        <div ref={containerRef}></div>
      </div>
    );
  },
);

BivariateMatrixCellConnector.displayName = 'BivariateMatrixCellConnector';
