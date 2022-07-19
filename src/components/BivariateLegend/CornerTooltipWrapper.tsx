import { cloneElement, isValidElement } from 'react';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import { TooltipWrapper } from '~components/Tooltip';
import { capitalizeArrayOrString } from '~utils/common';
import { CORNER_POINTS_INDEXES } from './const';
import s from './CornerTooltipWrapper.module.css';
import type { ReactNode, PointerEvent } from 'react';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';
import type { BivariateLegendProps } from './BivariateLegend';
import type { CornerRange } from '~utils/bivariate';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { TooltipData } from '~core/shared_state/currentTooltip';

export type CornerTooltipWrapperProps = {
  meta: BivariateLegendProps['meta'];
  children: ReactNode;
};

const CornerTooltipWrapper = ({
  children,
  meta,
}: CornerTooltipWrapperProps) => {
  const renderTooltip = (
    e: PointerEvent<Element>,
    setTooltip: (tooltipData: TooltipData) => void,
    _cell: Cell,
    i: number,
  ) => {
    const cornerIndex = CORNER_POINTS_INDEXES.indexOf(i);
    if (meta?.hints && cornerIndex >= 0) {
      setTooltip({
        popup: (
          <BivariateLegendCornerTooltip
            cornerIndex={cornerIndex}
            hints={meta.hints}
          />
        ),
        position: { x: e.clientX, y: e.clientY },
        hoverBehavior: true,
      });
    }
  };

  return isValidElement(children) ? (
    <TooltipWrapper renderTooltip={renderTooltip}>
      {({ showTooltip, hideTooltip }) =>
        cloneElement(children, {
          onCellPointerOver: showTooltip,
          onCellPointerLeave: hideTooltip,
        })
      }
    </TooltipWrapper>
  ) : null;
};

const isBottomCornerPoint = (cornerIndex: number): boolean =>
  cornerIndex === 2 || cornerIndex === 3;

const isLeftCornerPoint = (cornerIndex: number): boolean =>
  cornerIndex === 0 || cornerIndex === 2;

const formatSentimentDirection = (direction: Array<CornerRange>): string =>
  capitalizeArrayOrString(direction);

const LOW = `↓${i18n.t('bivariate.legend.low')}`;
const HIGH = `↑${i18n.t('bivariate.legend.high')}`;

const BivariateLegendCornerTooltip = ({
  hints,
  cornerIndex,
}: {
  hints: LayerMeta['hints'];
  cornerIndex: number;
}) => {
  if (!hints) return null;
  const rows = [
    {
      label: hints.x?.label,
      direction: hints.x?.direction?.[isBottomCornerPoint(cornerIndex) ? 0 : 1],
      indicator: isBottomCornerPoint(cornerIndex) ? LOW : HIGH,
    },
    {
      label: hints.y?.label,
      direction: hints.y?.direction?.[isLeftCornerPoint(cornerIndex) ? 0 : 1],
      indicator: isLeftCornerPoint(cornerIndex) ? LOW : HIGH,
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
