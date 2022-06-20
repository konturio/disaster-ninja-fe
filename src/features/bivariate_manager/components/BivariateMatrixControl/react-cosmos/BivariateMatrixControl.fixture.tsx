import { mock } from './mocks/mock-20';
import { useCallback, useMemo, useRef, useState } from 'react';
import { BivariateMatrixControlComponent } from '../index';
import styles from './BivariateMatrixControlFixture.module.css';

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
      mapHeaderCell(group, mock?.indicators as any);

    return {
      x: (mock.xGroups as AxisGroup[]).map(mapWithIndicators),
      y: (mock.yGroups as AxisGroup[]).map(mapWithIndicators),
    };
  }, [mock]);

  const [selectedCell, setSelectedCell] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const onSelectCellHandler = useCallback((x, y) => {
    console.log('onSelectCellHandler', x, y);
    setSelectedCell({ x, y });
  }, []);

  const onSelectDenominator = useCallback(
    (horizontal: boolean, index: number, numId: string, denId: string) => {
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
    </div>
  );
}
