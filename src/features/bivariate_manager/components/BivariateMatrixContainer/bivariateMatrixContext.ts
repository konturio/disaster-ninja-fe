import { createContext } from 'react';

export type MatrixPositionRecalculatedCb = (
  baseDimension: number,
  matrixSize: number,
) => void;

export interface BivariateMatrixContextInterface {
  onMatrixPositionRecalculated: MatrixPositionRecalculatedCb;
}

export const BivariateMatrixContext =
  createContext<BivariateMatrixContextInterface | null>(null);
