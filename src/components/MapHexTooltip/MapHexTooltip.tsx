import {
  HIGH,
  isBottomSide,
  isLeftSide,
  isRightSide,
  isTopSide,
  LOW,
  MEDIUM,
} from '~components/BivariateLegend/const';
import { formatBivariateAxisLabel } from '~utils/bivariate';
import s from './MapHexTooltip.module.css';
import type { BivariateLegend } from '~core/logical_layers/types/legends';

export const popupContentRoot = s.popupContentRoot;

const getXIndicatorLabelByindex = (index: number): string => {
  if (isBottomSide(index)) return LOW;
  if (isTopSide(index)) return HIGH;
  return MEDIUM;
};

const getYIndicatorLabelByindex = (index: number): string => {
  if (isLeftSide(index)) return LOW;
  if (isRightSide(index)) return HIGH;
  return MEDIUM;
};

type MapHexTooltipProps = {
  hexagonColor: string;
  axis: BivariateLegend['axis'];
  cellIndex: number;
  cellLabel: string;
  values?: { x: string; y: string };
};

export const MapHexTooltip = ({
  hexagonColor,
  axis,
  cellIndex,
  cellLabel,
  values,
}: MapHexTooltipProps) => {
  return (
    <div className={s.tootipRoot}>
      <div className={s.hexagon}>
        <div style={{ background: hexagonColor }}>{cellLabel}</div>
      </div>

      <div className={s.labels}>
        <div className={s.column}>
          <span>{axis.x.label || formatBivariateAxisLabel(axis.x.quotients)}</span>
          <span>{axis.y.label || formatBivariateAxisLabel(axis.y.quotients)}</span>
        </div>

        {values && (
          <div className={s.column}>
            <span>{values?.x}</span>
            <span>{values?.y}</span>
          </div>
        )}

        <div className={s.column}>
          <span>{getXIndicatorLabelByindex(cellIndex)}</span>
          <span>{getYIndicatorLabelByindex(cellIndex)}</span>
        </div>
      </div>
    </div>
  );
};
