import cn from 'clsx';
import React, { useImperativeHandle, useRef } from 'react';
import styles from './BivariateMatrixCell.module.css';

const memoize = (fn) => {
  const cache: Map<string, string> = new Map<string, string>();
  return (...args) => {
    const hash = args.map(Number).join('');
    if (hash in cache) {
      return cache[hash];
    } else {
      const result = fn(...args);
      cache[hash] = result;
      return result;
    }
  };
};

const memoizedClassGen = memoize(
  (
    isVisibleLocal: boolean,
    isHoveredLocal: boolean,
    isFromSelectedColLocal: boolean,
    isFromSelectedRowLocal: boolean,
    firstRowLocal: boolean,
    lastRowLocal: boolean,
    firstColLocal: boolean,
    lastColLocal: boolean,
  ) => {
    if (!isVisibleLocal) return styles.invisibleCell;
    return cn({
      [styles.hoveredCell]: isHoveredLocal,
      [styles.selectedCol]: isFromSelectedColLocal,
      [styles.selectedRow]: isFromSelectedRowLocal,
      [styles.first]:
        (firstRowLocal && isFromSelectedColLocal) ||
        (firstColLocal && isFromSelectedRowLocal),
      [styles.last]:
        (lastRowLocal && isFromSelectedColLocal) ||
        (lastColLocal && isFromSelectedRowLocal),
    });
  },
);

interface CellProps {
  value?: number;
  x: number;
  y: number;
  onMouseOver: (x: number, y: number) => void;
  onMouseOut: () => void;
  onClick: (x: number, y: number) => void;
  className?: string;
  disabled?: boolean;
  style?: Record<string, unknown>;
  firstRow?: boolean;
  firstCol?: boolean;
  lastRow?: boolean;
  lastCol?: boolean;
}

export const BivariateMatrixCell = React.forwardRef(
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

    let isVisible = true;

    let isHovered = false;
    let isFromSelectedRow = false;
    let isFromSelectedCol = false;

    const baseClassNames = cn(
      styles.valueCell,
      className,
      disabled && styles.disabled,
    );

    const generateClassNames = (): string => {
      return `${baseClassNames} ${memoizedClassGen(
        isVisible,
        isHovered,
        isFromSelectedCol,
        isFromSelectedRow,
        firstRow,
        lastRow,
        firstCol,
        lastCol,
      )}`;
    };

    useImperativeHandle(ref, () => ({
      setHovered: () => {
        isHovered = true;
        if (isVisible && containerRef.current) {
          containerRef.current.className = generateClassNames();
        }
      },
      resetHovered: () => {
        isHovered = false;
        if (isVisible && containerRef.current) {
          containerRef.current.className = generateClassNames();
        }
      },
      setSelectedCol: () => {
        isFromSelectedCol = true;
        if (isVisible && containerRef.current) {
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedCol: () => {
        isFromSelectedCol = false;
        if (isVisible && containerRef.current) {
          containerRef.current.className = generateClassNames();
        }
      },
      setSelectedRow: () => {
        isFromSelectedRow = true;
        if (isVisible && containerRef.current) {
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedRow: () => {
        isFromSelectedRow = false;
        if (isVisible && containerRef.current) {
          containerRef.current.className = generateClassNames();
        }
      },
      checkBounds: (
        left: number,
        top: number,
        right: number,
        bottom: number,
      ) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const cLeft = rect.left + window.scrollX;
        const cTop = rect.top + window.scrollY;
        const cRight = cLeft + rect.width;
        const cBottom = cTop + rect.height;

        if (
          isVisible &&
          (cRight < left || cBottom < top || cLeft > right || cTop > bottom)
        ) {
          isVisible = false;
          containerRef.current.className = generateClassNames();
        } else if (
          !isVisible &&
          cRight > left &&
          cBottom > top &&
          cLeft < right &&
          cTop < bottom
        ) {
          isVisible = true;
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
        onClick={() => {
          onClick(x, y);
        }}
        onMouseOut={onMouseOut}
      >
        {!disabled && value !== undefined ? (
          <>
            {Math.abs(value) >= 0.1 && (
              <div
                className={styles.valueFill}
                style={{ transform: `scale(${Math.abs(value)})` }}
              />
            )}
            <span className={styles.rotatedCell}>{value?.toFixed(3)}</span>
          </>
        ) : null}
      </div>
    );
  },
);

BivariateMatrixCell.displayName = 'BivariateMatrixCell';
