import { useCallback, useMemo, useRef, useState } from 'react';
import { PopupTooltip } from '~features/tooltip';
import { BivariateMatrixControlComponent } from '../index';
import { mock } from './mocks/mock-20';
import styles from './BivariateMatrixControlFixture.module.css';
import type { Indicator } from '../types';

type AxisGroup = {
  parent: string | null;
  quotients: Array<[string, string]>;
  selectedQuotient: [string, string];
};

const mapHeaderCell = (group: AxisGroup, indicators: Indicator[]) => ({
  label:
    indicators.find((indicator) => indicator.name === group.selectedQuotient[0])
      ?.label || '',
  selectedQuotient: {
    id: group.selectedQuotient,
    label: indicators.find(
      (indicator) => indicator.name === group.selectedQuotient[1],
    )?.label,
  },
  quality: 1,
  quotients: group.quotients.map((quotient) => ({
    id: quotient,
    label: indicators.find((indicator) => indicator.name === quotient[0])
      ?.label,
    quality: 1,
  })),
});

export default function BivariateMatrixControlFixture() {
  const ref = useRef(null);

  const headings = useMemo(() => {
    if (
      !mock.indicators ||
      !mock.xGroups ||
      !mock.xGroups.length ||
      !mock.yGroups ||
      !mock.yGroups.length
    ) {
      return null;
    }

    const mapWithIndicators = (group: AxisGroup) =>
      // eslint-disable-next-line
      mapHeaderCell(group, mock?.indicators as any);

    return {
      x: (mock.xGroups as AxisGroup[]).map(mapWithIndicators),
      y: (mock.yGroups as AxisGroup[]).map(mapWithIndicators),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mock]);

  const [selectedCell, setSelectedCell] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const onSelectCellHandler = useCallback((x, y) => {
    /* eslint-disable */
    console.log('onSelectCellHandler', x, y);
    setSelectedCell({ x, y });
  }, []);

  const onSelectDenominator = useCallback(
    (horizontal: boolean, index: number, numId: string, denId: string) => {
      /* eslint-disable */
      console.log('onSelectDenominator', horizontal, index, numId, denId);
    },
    [],
  );

  return (
    <div className={styles.axisMatrix}>
      <BivariateMatrixControlComponent
        ref={ref}
        matrix={mock.matrix}
        xHeadings={headings?.x}
        yHeadings={headings?.y}
        onSelectCell={onSelectCellHandler}
        selectedCell={selectedCell}
        onSelectDenominator={onSelectDenominator}
      />
      <PopupTooltip />
    </div>
  );
}
