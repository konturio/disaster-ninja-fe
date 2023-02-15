import { useMemo } from 'react';
import {
  BIVARIATE_MATRIX_HEIGHT_SHIFT,
  BIVARIATE_MATRIX_WIDTH_SHIFT,
} from '../constants';

export function setOffset(offsetX = 0, offsetY = 0) {
  return {
    col: (index: number) => index + offsetX,
    row: (index: number) => index + offsetY,
  };
}

export function useGridStyle(x: number, y: number, cellSize = 0) {
  const memoizedGridStyle = useMemo(
    () => ({
      display: 'inline-grid',
      '--cell-size': cellSize === 0 ? 'initial' : `${cellSize}px`,
      gridTemplateRows: `repeat(${y}, ${cellSize === 0 ? 'auto' : cellSize + 'px'})`,
      gridTemplateColumns: `repeat(${x}, ${cellSize === 0 ? 'auto' : cellSize + 'px'})`,
    }),
    [x, y, cellSize],
  );

  return memoizedGridStyle;
}

export function generateCellStyles(
  maxCols: number,
  maxRows: number,
): { gridColumn: string; gridRow: string }[][] {
  const cellStyles: { gridColumn: string; gridRow: string }[][] = [];
  for (let i = 0; i < maxCols; i++) {
    cellStyles[i] = [];
    for (let j = 0; j < maxRows; j++) {
      cellStyles[i][j] = {
        gridColumn: `${i} / ${i + 1}`,
        gridRow: `${j} / ${j + 1}`,
      };
    }
  }
  return cellStyles;
}

export function useBaseMatrixDimension(xHeadings, yHeadings) {
  // calculate base width of header item
  const memoizedBaseDimension = useMemo(() => {
    if (!xHeadings || !xHeadings.length || !yHeadings || !yHeadings.length) return 0;

    let xLength = calculateStringWidth(xHeadings[0].label);
    for (let i = 1; i < xHeadings.length; i++) {
      const iStrWidth = calculateStringWidth(xHeadings[i].label);
      const shift = i * BIVARIATE_MATRIX_HEIGHT_SHIFT;
      if (iStrWidth > xLength + shift) {
        xLength = iStrWidth - shift;
      }
    }
    let yLength = calculateStringWidth(yHeadings[0].label);
    for (let i = 1; i < yHeadings.length; i++) {
      const iStrWidth = calculateStringWidth(yHeadings[i].label);
      const shift = i * BIVARIATE_MATRIX_WIDTH_SHIFT;
      if (iStrWidth > yLength + shift) {
        yLength = iStrWidth - shift;
      }
    }

    return xLength > yLength ? xLength : yLength;
  }, [xHeadings, yHeadings]);

  return memoizedBaseDimension;
}

// text width measure hack
const canvas = document.createElement('canvas');
const context: any = canvas.getContext('2d') || {};
context.font = 'normal 13px Roboto';

const QUOTIENT_ICON_SIZE = 30;
const QUOTIENTS_DROPDOWN_SIZE = 90;
export function calculateStringWidth(str: string): number {
  return context.measureText(str).width + QUOTIENT_ICON_SIZE + QUOTIENTS_DROPDOWN_SIZE;
}

export function calculateHeadingsStyle(
  baseDimension: number,
  vertical: boolean,
  index: number,
) {
  return vertical
    ? { height: `${baseDimension + index * BIVARIATE_MATRIX_HEIGHT_SHIFT}px` }
    : { width: `${baseDimension + index * BIVARIATE_MATRIX_WIDTH_SHIFT}px` };
}
