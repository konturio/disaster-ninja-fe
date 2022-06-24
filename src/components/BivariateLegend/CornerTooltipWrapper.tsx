import { cloneElement } from 'react';
import { useAction } from '@reatom/react';
import clsx from 'clsx';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { BIVARIATE_LEGEND_SIZE } from './const';
import s from './CornerTooltipWrapper.module.css';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';

const CORNER_POINTS_INDEXES = [
  0,
  BIVARIATE_LEGEND_SIZE - 1,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - 1,
];

const CornerTooltipWrapper = ({ children, meta }) => {
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
          <BivariateLegendCornerTooltip
            cornerIndex={cornerIndex}
            meta={meta.hints}
          />
        ),
        position: { x: e.clientX - 40, y: e.clientY },
        hoverBehavior: true,
      });
    }
  }

  function onMouseLeave() {
    resetTooltip();
  }

  return cloneElement(children, {
    onCellMouseEnter: onMouseEnter,
    onCellMouseLeave: onMouseLeave,
  });
};
const isBottomCornerPoint = (cornerIndex: number): boolean =>
  cornerIndex === 2 || cornerIndex === 3;

const isLeftCornerPoint = (cornerIndex: number): boolean =>
  cornerIndex === 0 || cornerIndex === 2;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const BivariateLegendCornerTooltip = ({ meta, cornerIndex }: any) => {
  function formatSentimentDirection(direction) {
    if (Array.isArray(direction)) {
      return direction.map(capitalize).join(', ');
    } else return capitalize(direction);
  }
  return (
    <div className={clsx(s.tooltipRoot)}>
      <div className={clsx(s.tooltipRow)}>
        <span className={clsx(s.indicator)}>
          {isBottomCornerPoint(cornerIndex) ? '↓Low' : '↑High'}
        </span>

        <span className={clsx(s.sentimentInfo)}>
          <span className={clsx(s.sentimentLabel)}>{meta?.x?.label} </span>
          <span className={clsx(s.sentimentDirection)}>
            {formatSentimentDirection(
              meta.x.directions[isBottomCornerPoint(cornerIndex) ? 0 : 1],
            )}
          </span>
        </span>
      </div>
      <div className={clsx(s.tooltipRow)}>
        <span className={clsx(s.indicator)}>
          {isLeftCornerPoint(cornerIndex) ? '↓Low' : '↑High'}{' '}
        </span>

        <span className={clsx(s.sentimentInfo)}>
          <span className={clsx(s.sentimentLabel)}>{meta?.y?.label} </span>
          <span className={clsx(s.sentimentDirection)}>
            {formatSentimentDirection(
              meta.y.directions[isLeftCornerPoint(cornerIndex) ? 0 : 1],
            )}
          </span>
        </span>
      </div>
    </div>
  );
};

export { CornerTooltipWrapper };
