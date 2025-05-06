import { cloneElement, isValidElement, useState } from 'react';
import clsx from 'clsx';
import { formatSentimentDirection } from '~utils/bivariate';
import { SimpleRefTooltip } from '~components/Floating/SimpleRefTooltip';
import { LOW, HIGH, isBottomSide, isLeftSide, CORNER_POINTS_INDEXES } from './const';
import s from './CornerTooltipWrapper.module.css';
import type { ReactNode, MouseEvent } from 'react';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';
import type { LayerMeta } from '~core/logical_layers/types/meta';

export type CornerTooltipWrapperProps = {
  hints: LayerMeta['hints'];
  children: ReactNode;
};

export function CornerTooltipWrapper({ children, hints }: CornerTooltipWrapperProps) {
  const [activeCorner, setActiveCorner] = useState<number | null>(null);
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);

  const handleShowTooltip = (e: MouseEvent<Element>, _cell: Cell, i: number) => {
    if (hints && CORNER_POINTS_INDEXES.includes(i)) {
      setActiveCorner(i);
      // @ts-expect-error to fix in label generator, remove span wrappers
      const divRef = e.target?.tagName == 'SPAN' ? e.target.parentElement : e.target;
      setReferenceEl(divRef as HTMLElement);
    }
  };

  const handleHideTooltip = () => {
    setActiveCorner(null);
    setReferenceEl(null);
  };

  return (
    <>
      {isValidElement(children)
        ? cloneElement(children, {
            // @ts-expect-error - Legend component accepts these props but TS doesn't recognize them
            onCellPointerOver: handleShowTooltip,
            onCellPointerLeave: handleHideTooltip,
          })
        : null}

      <SimpleRefTooltip
        referenceElement={referenceEl}
        isOpen={activeCorner !== null && referenceEl !== null && !!hints}
        content={
          <BivariateLegendCornerTooltip
            cellIndex={activeCorner as number}
            hints={hints}
          />
        }
      />
    </>
  );
}

const BivariateLegendCornerTooltip = ({
  hints,
  cellIndex,
}: {
  hints: LayerMeta['hints'];
  cellIndex: number;
}) => {
  if (!hints) return null;
  const rows = [
    {
      label: hints.x?.label,
      direction: hints.x?.direction?.[isBottomSide(cellIndex) ? 0 : 1],
      indicator: isBottomSide(cellIndex) ? LOW : HIGH,
    },
    {
      label: hints.y?.label,
      direction: hints.y?.direction?.[isLeftSide(cellIndex) ? 0 : 1],
      indicator: isLeftSide(cellIndex) ? LOW : HIGH,
    },
  ];

  return (
    <div className={clsx(s.tooltipRoot)}>
      {rows.map(({ label, direction, indicator }, i) => (
        <div key={i} className={clsx(s.tooltipRow)}>
          <span className={clsx(s.indicator)}>{indicator}</span>

          <span className={clsx(s.sentimentInfo)}>
            <span className={clsx(s.sentimentLabel)}>{label} </span>

            {direction && (
              <span className={clsx(s.sentimentDirection)}>
                {formatSentimentDirection(direction)}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};
