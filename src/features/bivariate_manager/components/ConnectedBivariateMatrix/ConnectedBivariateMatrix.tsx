import { AxisControl } from '@k2-packages/ui-kit';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Axis, Indicator } from '@k2-packages/bivariate-tools';
import { NumeratorWithDenominators } from '~core/types';
import { CorrelationRate } from '@k2-packages/bivariate-tools/tslib/types/stat.types';
import { useAtom } from '@reatom/react';
import { bivariateMatrixSelectionAtom } from '~features/bivariate_manager/atoms/bivariateMatrixSelection';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { bivariateCorrelationMatrixAtom } from '~features/bivariate_manager/atoms/bivatiateCorrelationMatrix';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';

const qualityFormat = (quality?) =>
  typeof quality === 'number'
    ? Math.floor(quality * 100).toString()
    : undefined;

const mapHeaderCell = (
  numerator: NumeratorWithDenominators,
  indicators: Indicator[],
  correlationRates: CorrelationRate[],
  axis: 'x' | 'y',
) => ({
  label:
    indicators.find((indicator) => indicator.name === numerator.numeratorId)
      ?.label || '',
  selectedDenominator: {
    id: numerator.selectedDenominator,
    label: indicators.find(
      (indicator) => indicator.name === numerator.selectedDenominator,
    )?.label,
  },
  quality: qualityFormat(
    correlationRates.find(
      (cr) =>
        cr[axis].quotient[0] === numerator.numeratorId &&
        cr[axis].quotient[1] === numerator.selectedDenominator,
    )?.[axis === 'x' ? 'avgCorrelationX' : 'avgCorrelationY'],
  ),
  denominators: numerator.denominators.map((denId) => ({
    id: denId,
    label: indicators.find((indicator) => indicator.name === denId)?.label,
    quality: qualityFormat(
      correlationRates.find(
        (cr) =>
          cr[axis].quotient[0] === numerator.numeratorId &&
          cr[axis].quotient[1] === denId,
      )?.[axis === 'x' ? 'avgCorrelationX' : 'avgCorrelationY'],
    ),
  })),
});

const ConnectedBivariateMatrix = forwardRef<HTMLDivElement | null, any>(
  ({}, ref) => {
    const [matrixSelection, { setMatrixSelection }] = useAtom(
      bivariateMatrixSelectionAtom,
    );
    const [matrix] = useAtom(bivariateCorrelationMatrixAtom);
    const [{ xNumerators, yNumerators }, { setNumerators }] = useAtom(
      bivariateNumeratorsAtom,
    );
    const [{ data: statisticsData }] = useAtom(bivariateStatisticsResourceAtom);
    const stats = statisticsData?.polygonStatistic.bivariateStatistic;

    const selectedCell = useMemo(() => {
      const xIndex = xNumerators?.findIndex(
        (numerator) =>
          numerator.numeratorId === matrixSelection?.xNumerator &&
          numerator.denominators[0] === matrixSelection?.xDenominator,
      );
      const yIndex = yNumerators?.findIndex(
        (numerator) =>
          numerator.numeratorId === matrixSelection?.yNumerator &&
          numerator.denominators[0] === matrixSelection?.yDenominator,
      );

      return { x: xIndex, y: yIndex };
    }, [matrixSelection, xNumerators, yNumerators]);

    const headings = useMemo(() => {
      if (
        !stats ||
        !stats.indicators ||
        !xNumerators ||
        !xNumerators.length ||
        !yNumerators ||
        !yNumerators.length
      ) {
        return null;
      }

      const mapWithIndicators =
        (axis: 'x' | 'y') => (numerator: NumeratorWithDenominators) =>
          mapHeaderCell(
            numerator,
            stats?.indicators,
            stats?.correlationRates,
            axis,
          );

      return {
        x: xNumerators.map(mapWithIndicators('x')),
        y: yNumerators.map(mapWithIndicators('y')),
      };
    }, [stats, xNumerators, yNumerators]);

    const onSelectCellHandler = useCallback(
      (e, { x, y }) => {
        if (
          !xNumerators ||
          !yNumerators ||
          (x === selectedCell.x && y === selectedCell.y)
        )
          return;
        setMatrixSelection(
          x !== -1 ? xNumerators[x].numeratorId : null,
          x !== -1 ? xNumerators[x].selectedDenominator : null,
          y !== -1 ? yNumerators[y].numeratorId : null,
          y !== -1 ? yNumerators[y].selectedDenominator : null,
        );
      },
      [xNumerators, yNumerators, selectedCell],
    );

    return matrix && headings ? (
      <AxisControl
        ref={ref}
        matrix={matrix}
        xHeadings={headings.x}
        yHeadings={headings.y}
        onSelectCell={onSelectCellHandler}
        selectedCell={selectedCell}
        onSelectDenominator={() => {
          /* do nothing */
        }}
      />
    ) : null;
  },
);

ConnectedBivariateMatrix.displayName = 'ConnectedBivariateMatrix';

export default ConnectedBivariateMatrix;
