import { cloneElement, isValidElement } from 'react';
import clsx from 'clsx';
import { PopupTooltipWrapper } from '~components/TooltipTrigger';
import { formatSentimentDirection } from '~utils/bivariate';
import { LOW, HIGH, isBottomSide, isLeftSide, CORNER_POINTS_INDEXES } from './const';
import s from './CornerTooltipWrapper.module.css';
import type { ReactNode, MouseEvent } from 'react';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { TooltipData } from '~core/shared_state/currentTooltip';

export type CornerTooltipWrapperProps = {
  hints: LayerMeta['hints'];
  children: ReactNode;
};

const CornerTooltipWrapper = ({ children, hints }: CornerTooltipWrapperProps) => {
  const renderTooltip = (
    e: MouseEvent<Element>,
    setTooltip: (tooltipData: TooltipData) => void,
    _cell: Cell,
    i: number,
  ) => {
    if (hints && CORNER_POINTS_INDEXES.includes(i)) {
      setTooltip({
        popup: <BivariateLegendCornerTooltip cellIndex={i} hints={hints} />,
        position: { x: e.clientX, y: e.clientY },
        hoverBehavior: true,
      });
    }
  };

  return isValidElement(children) ? (
    <PopupTooltipWrapper renderTooltip={renderTooltip}>
      {({ showTooltip, hideTooltip }) =>
        cloneElement(children, {
          // @ts-expect-error - react version update should fix that
          onCellPointerOver: showTooltip,
          onCellPointerLeave: hideTooltip,
        })
      }
    </PopupTooltipWrapper>
  ) : null;
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
