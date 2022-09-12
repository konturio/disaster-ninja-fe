import { forwardRef, useCallback, useEffect, useMemo } from 'react';
import { useAction, useAtom } from '@reatom/react';
import debounce from 'lodash.debounce';
import { bivariateMatrixSelectionAtom } from '~features/bivariate_manager/atoms/bivariateMatrixSelection';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { bivariateCorrelationMatrixAtom } from '~features/bivariate_manager/atoms/bivatiateCorrelationMatrix';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { BivariateMatrixControlComponent } from '../BivariateMatrixControl';
import { ProgressTooltip } from '../ProgressTooltip/ProgressTooltip';
import type { AxisGroup } from '~core/types';
import type { Indicator, CorrelationRate } from '~utils/bivariate';

const TOOLTIP_ID = 'BIVARIATE_MATRIX_CELL_TOOLTIP';

const qualityFormat = (quality?) =>
  typeof quality === 'number' ? Math.floor(quality * 100).toString() : undefined;

const mapHeaderCell = (
  group: AxisGroup,
  indicators: Indicator[],
  correlationRates: CorrelationRate[],
  axis: 'x' | 'y',
) => ({
  label:
    indicators.find((indicator) => indicator.name === group.selectedQuotient[0])?.label ||
    '',
  selectedQuotient: {
    id: group.selectedQuotient,
    label: indicators.find((indicator) => indicator.name === group.selectedQuotient[1])
      ?.label,
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
    label: indicators.find((indicator) => indicator.name === quotient[0])?.label,
    quality: qualityFormat(
      correlationRates.find(
        (cr) =>
          cr[axis].quotient[0] === quotient[0] && cr[axis].quotient[1] === quotient[1],
      )?.[axis === 'x' ? 'avgCorrelationX' : 'avgCorrelationY'],
    ),
  })),
});
const ConnectedBivariateMatrix = forwardRef<HTMLDivElement | null, any>(({}, ref) => {
  const [{ selectedCell }, { setMatrixSelection, setPreselectMode }] = useAtom(
    bivariateMatrixSelectionAtom,
  );
  const [matrix] = useAtom(bivariateCorrelationMatrixAtom);

  const [{ xGroups, yGroups }, { setNumerators }] = useAtom(bivariateNumeratorsAtom);
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const turnOffById = useAction(currentTooltipAtom.turnOffById);
  const resetTooltip = () => turnOffById(TOOLTIP_ID);

  const [{ data: statisticsData }] = useAtom(bivariateStatisticsResourceAtom);

  const stats = statisticsData?.polygonStatistic.bivariateStatistic;

  useEffect(() => {
    setPreselectMode(true);

    return () => {
      setPreselectMode(false);
    };
  }, [setPreselectMode]);

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

  const debouncedShowTooltip = useCallback(
    debounce((position) => {
      resetTooltip();
      setTooltip({
        popup: <ProgressTooltip close={resetTooltip} />,
        position,
        initiatorId: TOOLTIP_ID,
        hoverBehavior: true,
      });
    }, 400),
    [resetTooltip, setTooltip],
  );

  const onSelectCellHandler = useCallback(
    (x, y, e) => {
      if (
        !xGroups ||
        !yGroups ||
        (selectedCell && x === selectedCell.x && y === selectedCell.y)
      )
        return;
      setMatrixSelection(
        x !== -1 ? xGroups[x].selectedQuotient[0] : null,
        x !== -1 ? xGroups[x].selectedQuotient[1] : null,
        y !== -1 ? yGroups[y].selectedQuotient[0] : null,
        y !== -1 ? yGroups[y].selectedQuotient[1] : null,
      );

      if (e && x >= 0 && y >= 0) {
        debouncedShowTooltip({ x: e.clientX, y: e.clientY });
      }
    },
    [xGroups, yGroups, setMatrixSelection, debouncedShowTooltip, selectedCell],
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
          selectedCell &&
          selectedCell?.x >= 0 &&
          selectedCell?.y >= 0 &&
          ((horizontal && selectedCell.y === index) ||
            (!horizontal && selectedCell.x === index))
        ) {
          setMatrixSelection(
            newXGroups[selectedCell.x].selectedQuotient[0],
            newXGroups[selectedCell.x].selectedQuotient[1],
            newYGroups[selectedCell.y].selectedQuotient[0],
            newYGroups[selectedCell.y].selectedQuotient[1],
          );
        }
      }
    },
    [selectedCell, setMatrixSelection, setNumerators, xGroups, yGroups],
  );

  return matrix && headings ? (
    <BivariateMatrixControlComponent
      ref={ref}
      matrix={matrix}
      xHeadings={headings.x}
      yHeadings={headings.y}
      onSelectCell={onSelectCellHandler}
      selectedCell={selectedCell}
      onSelectQuotient={onSelectQuotient}
    />
  ) : null;
});

ConnectedBivariateMatrix.displayName = 'ConnectedBivariateMatrix';

export default ConnectedBivariateMatrix;
