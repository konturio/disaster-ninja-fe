import { MapIndex } from '../MapIndex';
import { Matrix } from '../Matrix';
import type { Axis, CorrelationRate } from '../../types/stat.types';

export type TableHeading = {
  id: string;
  quality?: number;
};

export interface Table {
  x: TableHeading[];
  y: TableHeading[];
  matrix: (number | null)[][];
}

export function ratesToTable(correlationRate: CorrelationRate[]): Table {
  const rows = new MapIndex<string, Axis>();
  const cols = new MapIndex<string, Axis>();
  const matrix = new Matrix<number>();

  correlationRate.forEach(({ x, y, rate }) => {
    const xPos = cols.setValueAndGetIndex(x.quotient[0], x);
    const yPos = rows.setValueAndGetIndex(y.quotient[0], y);
    matrix.set(yPos, xPos, rate);
  });

  return {
    x: cols.dump().map(([axisId, axis]) => ({ id: axisId, quality: axis.quality })),
    y: rows.dump().map(([axisId, axis]) => ({ id: axisId, quality: axis.quality })),
    matrix: matrix.dump(cols.length, rows.length),
  };
}
