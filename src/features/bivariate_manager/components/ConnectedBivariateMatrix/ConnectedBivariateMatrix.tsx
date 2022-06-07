import { BivariateMatrixControlComponent } from '@konturio/ui-kit';
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Indicator, CorrelationRate } from '~utils/bivariate';
import type { AxisGroup } from '~core/types';
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
  group: AxisGroup,
  indicators: Indicator[],
  correlationRates: CorrelationRate[],
  axis: 'x' | 'y',
) => ({
  label:
    indicators.find((indicator) => indicator.name === group.selectedQuotient[0])
      ?.label || '',
  selectedQuotient: {
    id: group.selectedQuotient,
    label: indicators.find(
      (indicator) => indicator.name === group.selectedQuotient[1],
    )?.label,
  },
  quality: qualityFormat(
    correlationRates.find(
      (cr) =>
        cr[axis].quotient[0] === group.selectedQuotient[0] &&
        cr[axis].quotient[1] === group.selectedQuotient[1],
    )?.[axis === 'x' ? 'avgCorrelationX' : 'avgCorrelationY'],
  ),
  quotients: group.quotients.map((quotient) => ({
    id: quotient,
    label: indicators.find((indicator) => indicator.name === quotient[0])
      ?.label,
    quality: qualityFormat(
      correlationRates.find(
        (cr) =>
          cr[axis].quotient[0] === quotient[0] &&
          cr[axis].quotient[1] === quotient[1],
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

    const [{ xGroups, yGroups }, { setNumerators }] = useAtom(
      bivariateNumeratorsAtom,
    );

    const [{ data: statisticsData }] = useAtom(bivariateStatisticsResourceAtom);

    const stats = statisticsData?.polygonStatistic.bivariateStatistic;

    const calculateSelectedCell = useCallback((): { x: number; y: number } => {
      const xIndex = xGroups
        ? xGroups.findIndex(
            (group) =>
              group.selectedQuotient[0] === matrixSelection?.xNumerator &&
              group.selectedQuotient[1] === matrixSelection?.xDenominator,
          )
        : -1;
      const yIndex = yGroups
        ? yGroups.findIndex(
            (group) =>
              group.selectedQuotient[0] === matrixSelection?.yNumerator &&
              group.selectedQuotient[1] === matrixSelection?.yDenominator,
          )
        : -1;

      return { x: xIndex, y: yIndex };
    }, [xGroups, yGroups, matrixSelection]);

    const selectedCell = useRef<{ x: number; y: number }>(
      calculateSelectedCell(),
    );

    useEffect(() => {
      selectedCell.current = calculateSelectedCell();
    }, [matrixSelection, xGroups, yGroups]);

    const headings = useMemo(() => {
      if (
        !stats ||
        !stats.indicators ||
        !xGroups ||
        !xGroups.length ||
        !yGroups ||
        !yGroups.length
      ) {
        return null;
      }

      const mapWithIndicators = (axis: 'x' | 'y') => (group: AxisGroup) =>
        mapHeaderCell(group, stats?.indicators, stats?.correlationRates, axis);

      return {
        x: xGroups.map(mapWithIndicators('x')),
        y: yGroups.map(mapWithIndicators('y')),
      };
    }, [stats, xGroups, yGroups]);

    const onSelectCellHandler = useCallback(
      (x, y) => {
        if (
          !xGroups ||
          !yGroups ||
          (x === selectedCell.current.x && y === selectedCell.current.y)
        )
          return;
        setMatrixSelection(
          x !== -1 ? xGroups[x].selectedQuotient[0] : null,
          x !== -1 ? xGroups[x].selectedQuotient[1] : null,
          y !== -1 ? yGroups[y].selectedQuotient[0] : null,
          y !== -1 ? yGroups[y].selectedQuotient[1] : null,
        );
      },
      [xGroups, yGroups],
    );

    const onSelectQuotient = useCallback(
      (horizontal: boolean, index: number, numId: string, denId: string) => {
        const groups = horizontal ? yGroups : xGroups;
        if (xGroups && yGroups) {
          const newGroups = [...groups];
          const selectedQuotient = groups[index].quotients.find(
            (q: [string, string]) => q[0] === numId && q[1] === denId,
          );
          if (selectedQuotient) {
            newGroups[index] = { ...groups[index], selectedQuotient };
          }

          const newXGroups = horizontal ? xGroups : newGroups;
          const newYGroups = horizontal ? newGroups : yGroups;

          setNumerators(newXGroups, newYGroups);

          // refresh colors
          if (
            selectedCell.current.x !== undefined &&
            selectedCell.current.y !== undefined &&
            selectedCell.current.x !== -1 &&
            selectedCell.current.y !== -1 &&
            ((horizontal && selectedCell.current.y === index) ||
              (!horizontal && selectedCell.current.x === index))
          ) {
            setMatrixSelection(
              newXGroups[selectedCell.current.x].selectedQuotient[0],
              newXGroups[selectedCell.current.x].selectedQuotient[1],
              newYGroups[selectedCell.current.y].selectedQuotient[0],
              newYGroups[selectedCell.current.y].selectedQuotient[1],
            );
          }
        }
      },
      [xGroups, yGroups],
    );

    return matrix && headings ? (
      <BivariateMatrixControlComponent
        ref={ref}
        matrix={matrix}
        xHeadings={headings.x}
        yHeadings={headings.y}
        onSelectCell={onSelectCellHandler}
        selectedCell={selectedCell.current}
        onSelectQuotient={onSelectQuotient}
      />
    ) : null;
  },
);

ConnectedBivariateMatrix.displayName = 'ConnectedBivariateMatrix';

export default ConnectedBivariateMatrix;
