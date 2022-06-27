import { cloneElement, isValidElement } from 'react';
import { useAction } from '@reatom/react';
import clsx from 'clsx';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { BIVARIATE_LEGEND_SIZE } from './const';
import s from './CornerTooltipWrapper.module.css';
import type { ReactNode } from 'react';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';
import type { BivariateLegendProps } from './BivariateLegend';
import type { CornerRange } from '~utils/bivariate';

export type CornerTooltipWrapperProps = {
  meta: BivariateLegendProps['meta'];
  children: ReactNode | ReactNode[];
};

const CORNER_POINTS_INDEXES = [
  0,
  BIVARIATE_LEGEND_SIZE - 1,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - 1,
];

const CornerTooltipWrapper = ({
  children,
  meta,
}: CornerTooltipWrapperProps) => {
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

  function onMouseEnter(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    cell: Cell,
    i: number,
  ) {
    const cornerIndex = CORNER_POINTS_INDEXES.indexOf(i);
    if (cornerIndex >= 0) {
      setTooltip({
        popup: (
          <BivariateLegendCornerTooltip cornerIndex={cornerIndex} meta={meta} />
        ),
        position: { x: e.clientX - 40, y: e.clientY },
        hoverBehavior: true,
      });
    }
  }

  function onMouseLeave() {
    resetTooltip();
  }

  return isValidElement(children)
    ? cloneElement(children, {
        onCellMouseEnter: onMouseEnter,
        onCellMouseLeave: onMouseLeave,
      })
    : null;
};
const isBottomCornerPoint = (cornerIndex: number): boolean =>
  cornerIndex === 2 || cornerIndex === 3;

const isLeftCornerPoint = (cornerIndex: number): boolean =>
  cornerIndex === 0 || cornerIndex === 2;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatSentimentDirection = (direction: Array<CornerRange>): string => {
  if (Array.isArray(direction)) {
    return direction.map(capitalize).join(', ');
  } else return capitalize(direction);
};

const BivariateLegendCornerTooltip = ({
  meta,
  cornerIndex,
}: {
  meta: BivariateLegendProps['meta'];
  cornerIndex: number;
}) => {
  if (!meta?.hints) return null;

  const { hints } = meta;
  const rows = [
    {
      label: hints.x?.label,
      direction:
        hints.x?.directions?.[isBottomCornerPoint(cornerIndex) ? 0 : 1],
    },
    {
      label: hints.y?.label,
      direction: hints.y?.directions?.[isLeftCornerPoint(cornerIndex) ? 0 : 1],
    },
  ];

  return (
    <div className={clsx(s.tooltipRoot)}>
      {rows.map(({ label, direction }, i) => (
        <div key={i} className={clsx(s.tooltipRow)}>
          <span className={clsx(s.indicator)}>
            {isBottomCornerPoint(cornerIndex) ? '↓Low' : '↑High'}
          </span>

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
