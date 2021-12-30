import { AxisControl } from '@k2-packages/ui-kit';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Axis, Indicator } from '@k2-packages/bivariate-tools';
import { NumeratorWithDenominators } from '~core/types';
import { useAtom } from '@reatom/react';
import { bivariateMatrixSelectionAtom } from '~features/bivariate_manager/atoms/bivariateMatrixSelection';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { bivariateCorrelationMatrixAtom } from '~features/bivariate_manager/atoms/bivatiateCorrelationMatrix';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';

const qualityFormat = (quality?) =>
  quality ? Math.floor(quality * 100) : undefined;

const mapHeaderCell = (
  numerator: NumeratorWithDenominators,
  indicators: Indicator[],
  axis: Axis[],
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
    axis.find(
      (ax) =>
        ax.quotient[0] === numerator.numeratorId &&
        ax.quotient[1] === numerator.selectedDenominator,
    )?.quality,
  ),
  denominators: numerator.denominators.map((denId) => ({
    id: denId,
    label: indicators.find((indicator) => indicator.name === denId)?.label,
    quality: qualityFormat(
      axis.find(
        (ax) =>
          ax.quotient[0] === numerator.numeratorId && ax.quotient[1] === denId,
      )?.quality,
    ),
  })),
});

const ConnectedBivariateMatrix = forwardRef<HTMLDivElement | null, any>(({},ref) => {
    const [matrixSelection, { setMatrixSelection }] = useAtom(bivariateMatrixSelectionAtom);
    const [matrix] = useAtom(bivariateCorrelationMatrixAtom);
    const [{ xNumerators, yNumerators }, { setNumerators }] = useAtom(bivariateNumeratorsAtom);
    const [{ data: statisticsData }] = useAtom(bivariateStatisticsResourceAtom);
    const stats = statisticsData?.polygonStatistic.bivariateStatistic;

    const selectedCell = useMemo(() => {
      const xIndex = xNumerators?.findIndex(
        (numerator) => numerator.numeratorId === matrixSelection?.xNumerator,
      );
      const yIndex = yNumerators?.findIndex(
        (numerator) => numerator.numeratorId === matrixSelection?.yNumerator,
      );

      return { x: xIndex, y: yIndex };
    }, [matrixSelection, xNumerators, yNumerators]);

    const headings = useMemo(
      () => {
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

        const mapWithIndicators = (numerator: NumeratorWithDenominators) =>
          mapHeaderCell(numerator, stats?.indicators, stats?.axis);

        return {
          x: xNumerators.map(mapWithIndicators),
          y: yNumerators.map(mapWithIndicators),
        };
      }, [stats, xNumerators, yNumerators]
    );

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
          y !== -1 ? yNumerators[y].numeratorId : null,
        );
      },
      [xNumerators, yNumerators, selectedCell],
    );

    const onSelectDenominator = useCallback(
      (horizontal: boolean, index: number, denId: string) => {
        const props = horizontal ? yNumerators : xNumerators;
        if (xNumerators && yNumerators && props) {
          const newProps = [...props];
          newProps[index] = { ...props[index], selectedDenominator: denId };
          if (horizontal) {
            setNumerators(xNumerators, newProps);
          } else {
            setNumerators(newProps, yNumerators);
          }

          // refresh colors
          if (
            selectedCell.x !== undefined &&
            selectedCell.y !== undefined &&
            selectedCell.x !== -1 &&
            selectedCell.y !== -1 &&
            ((horizontal && selectedCell.y === index) ||
              (!horizontal && selectedCell.x === index))
          ) {
            setMatrixSelection(
              xNumerators[selectedCell.x].numeratorId,
              yNumerators[selectedCell.y].numeratorId,
            );
          }
        }
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
        onSelectDenominator={onSelectDenominator}
      />
    ) : null;
  },
);

ConnectedBivariateMatrix.displayName = 'ConnectedBivariateMatrix';

export default ConnectedBivariateMatrix;
