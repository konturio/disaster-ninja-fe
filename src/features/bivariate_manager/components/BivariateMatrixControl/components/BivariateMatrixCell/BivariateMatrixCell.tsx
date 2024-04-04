import cn from 'clsx';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './BivariateMatrixCell.module.css';
import type { CSSProperties, MouseEvent } from 'react';

interface CellProps {
  value?: number;
  x: number;
  y: number;
  onMouseOver: (x: number, y: number) => void;
  onMouseOut: () => void;
  onClick: (x: number, y: number, e: MouseEvent<Element>) => void;
  className?: string;
  disabled?: boolean;
  style?: CSSProperties;
  firstRow?: boolean;
  firstCol?: boolean;
  lastRow?: boolean;
  lastCol?: boolean;
}

export const BivariateMatrixCell = forwardRef(
  (
    {
      value,
      x,
      y,
      className,
      onMouseOver,
      onMouseOut,
      onClick,
      disabled = false,
      style,
      firstRow,
      firstCol,
      lastRow,
      lastCol,
    }: CellProps,
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    let isHovered = false;
    let isFromSelectedRow = false;
    let isFromSelectedCol = false;

    const baseClassNames = cn(styles.valueCell, className, disabled && styles.disabled);

    function generateClassNames(): string {
      return `${baseClassNames} ${cn({
        [styles.hoveredCell]: isHovered,
        [styles.selectedCol]: isFromSelectedCol,
        [styles.selectedRow]: isFromSelectedRow,
        [styles.first]:
          (firstRow && isFromSelectedCol) || (firstCol && isFromSelectedRow),
        [styles.last]: (lastRow && isFromSelectedCol) || (lastCol && isFromSelectedRow),
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
        if (containerRef.current) {
          isFromSelectedCol = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedCol: () => {
        if (containerRef.current) {
          isFromSelectedCol = false;
          containerRef.current.className = generateClassNames();
        }
      },
      setSelectedRow: () => {
        if (containerRef.current) {
          isFromSelectedRow = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedRow: () => {
        if (containerRef.current) {
          isFromSelectedRow = false;
          containerRef.current.className = generateClassNames();
        }
      },
    }));

    return (
      <div
        ref={containerRef}
        className={baseClassNames}
        style={style}
        onMouseOver={() => {
          onMouseOver(x, y);
        }}
        onClick={(e) => {
          onClick(x, y, e);
        }}
        onMouseOut={onMouseOut}
      >
        {!disabled && value !== undefined ? (
          <>
            {Math.abs(value) >= 0.1 && (
              <div
                className={styles.valueFill}
                style={{ transform: `scale(${Math.abs(value)})` }}
              ></div>
            )}
            <span className={styles.rotatedCell}>{value?.toFixed(3)}</span>
          </>
        ) : null}
      </div>
    );
  },
);

BivariateMatrixCell.displayName = 'BivariateMatrixCell';
