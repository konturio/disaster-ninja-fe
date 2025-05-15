import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAction, useAtom } from '@reatom/npm-react';
import { debounce } from '~utils/common';
import { bivariateStatisticsResourceAtom } from '~core/resources/bivariateStatisticsResource';
import { bivariateCorrelationMatrixAtom } from '../../atoms/bivatiateCorrelationMatrix';
import {
  bivariateNumeratorsAtom,
  setNumeratorsAction,
} from '../../atoms/bivariateNumerators';
import * as bmSelection from '../../atoms/bivariateMatrixSelection';
import { BivariateMatrixControlComponent } from '../BivariateMatrixControl';
import { ProgressTooltip } from '../ProgressTooltip/ProgressTooltip';
import type { AxisGroup } from '~core/types';
import type { Indicator, CorrelationRate } from '~utils/bivariate';

function qualityFormat(quality?) {
  return typeof quality === 'number' ? Math.floor(quality * 100).toString() : undefined;
}

function mapHeaderCell(
  group: AxisGroup,
  indicators: Indicator[],
  correlationRates: CorrelationRate[],
  axis: 'x' | 'y',
) {
  return {
    label:
      indicators.find((indicator) => indicator.name === group.selectedQuotient[0])
        ?.label || '',
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
  };
}

export function ConnectedBivariateMatrix() {
  const [{ selectedCell }] = useAtom(bmSelection.bivariateMatrixSelectionAtom);
  const setMatrixSelection = useAction(bmSelection.setMatrixSelectionAction);
  const runPreselection = useAction(bmSelection.runPreselectionAction);
  const selectedCellRef = useRef(selectedCell);
  const [matrix] = useAtom(bivariateCorrelationMatrixAtom);

  const [{ xGroups, yGroups }] = useAtom(bivariateNumeratorsAtom);
  const setNumerators = useAction(setNumeratorsAction);

  const [{ data: stats }] = useAtom(bivariateStatisticsResourceAtom.v3atom);

  // Local state for ProgressTooltip visibility and position
  const [progressTooltip, setProgressTooltip] = useState<{
    visible: boolean;
    position: { x: number; y: number } | null;
  }>({ visible: false, position: null });

  useEffect(() => {
    selectedCellRef.current = selectedCell;
  }, [selectedCell]);

  useEffect(() => {
    runPreselection();
  }, []);

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

  // Debounced show ProgressTooltip at mouse position
  const debouncedShowTooltip = useMemo(
    () =>
      debounce((position: { x: number; y: number }) => {
        setProgressTooltip({ visible: false, position: null }); // reset first
        setProgressTooltip({ visible: true, position });
      }, 400),
    [],
  );

  // Handler to close ProgressTooltip (passed to ProgressTooltip)
  const handleTooltipClose = useCallback(() => {
    setProgressTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const onSelectCellHandler = useCallback(
    (x, y, e) => {
      const previousCell = selectedCellRef.current;
      if (
        !xGroups ||
        !yGroups ||
        (previousCell && x === previousCell.x && y === previousCell.y)
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
    [xGroups, yGroups, setMatrixSelection, debouncedShowTooltip],
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

        setNumerators({ xGroups: newXGroups, yGroups: newYGroups });

        const previousCell = selectedCellRef.current;
        // refresh colors
        if (
          previousCell &&
          previousCell?.x >= 0 &&
          previousCell?.y >= 0 &&
          ((horizontal && previousCell.y === index) ||
            (!horizontal && previousCell.x === index))
        ) {
          setMatrixSelection(
            newXGroups[previousCell.x].selectedQuotient[0],
            newXGroups[previousCell.x].selectedQuotient[1],
            newYGroups[previousCell.y].selectedQuotient[0],
            newYGroups[previousCell.y].selectedQuotient[1],
          );
        }
      }
    },
    [setMatrixSelection, setNumerators, xGroups, yGroups],
  );

  return (
    <>
      {matrix && headings ? (
        <BivariateMatrixControlComponent
          matrix={matrix}
          xHeadings={headings.x}
          yHeadings={headings.y}
          onSelectCell={onSelectCellHandler}
          selectedCell={selectedCell}
          onSelectQuotient={onSelectQuotient}
        />
      ) : null}
      {progressTooltip.visible && progressTooltip.position && (
        <div
          style={{
            position: 'fixed',
            left: progressTooltip.position.x,
            top: progressTooltip.position.y,
            zIndex: 'var(--tooltip)',
            pointerEvents: 'none',
          }}
        >
          <ProgressTooltip close={handleTooltipClose} />
        </div>
      )}
    </>
  );
}
