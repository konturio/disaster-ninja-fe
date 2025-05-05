import { cloneElement, isValidElement, useState, useRef } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  FloatingArrow,
} from '@floating-ui/react';
import clsx from 'clsx';
import { formatSentimentDirection } from '~utils/bivariate';
import { LOW, HIGH, isBottomSide, isLeftSide, CORNER_POINTS_INDEXES } from './const';
import s from './CornerTooltipWrapper.module.css';
import type { ReactNode, MouseEvent } from 'react';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';
import type { LayerMeta } from '~core/logical_layers/types/meta';

export type CornerTooltipWrapperProps = {
  hints: LayerMeta['hints'];
  children: ReactNode;
};

const CornerTooltipWrapper = ({ children, hints }: CornerTooltipWrapperProps) => {
  const [activeCorner, setActiveCorner] = useState<number | null>(null);
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);
  const arrowRef = useRef(null);

  const { x, y, strategy, refs, context } = useFloating({
    placement: 'top',
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
  });

  const handleShowTooltip = (e: MouseEvent<Element>, _cell: Cell, i: number) => {
    if (hints && CORNER_POINTS_INDEXES.includes(i)) {
      setActiveCorner(i);
      setReferenceEl(e.target as HTMLElement);
      // @ts-expect-error to fix in label generator, remove span wrappers
      const divRef = e.target?.tagName == 'SPAN' ? e.target.parentElement : e.target;
      refs.setReference(divRef as HTMLElement);
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

      {activeCorner !== null && referenceEl && hints && (
        <div
          className={s.tooltipContent}
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 'var(--tooltip)',
          }}
        >
          <BivariateLegendCornerTooltip cellIndex={activeCorner} hints={hints} />
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className={s.arrow}
            stroke="transparent"
            strokeWidth={2}
            height={8}
            width={16}
          />
        </div>
      )}
    </>
  );
};

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

export { CornerTooltipWrapper };
