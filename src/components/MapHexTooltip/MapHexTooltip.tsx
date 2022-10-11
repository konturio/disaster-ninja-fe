import {
  HIGH,
  isBottomSide,
  isLeftSide,
  isRightSide,
  isTopSide,
  LOW,
  MEDIUM,
} from '~components/BivariateLegend/const';
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
};

export const MapHexTooltip = ({
  hexagonColor,
  axis,
  cellIndex,
  cellLabel,
}: MapHexTooltipProps) => {
  return (
    <div className={s.tootipRoot}>
      <div className={s.hexagon}>
        <div style={{ background: hexagonColor }}>{cellLabel}</div>
      </div>

      <div className={s.labels}>
        <div className={s.axisLabels}>
          <span>{axis.x.label}</span>
          <span>{axis.y.label}</span>
        </div>

        <div className={s.indicatorsLabels}>
          <span>{getXIndicatorLabelByindex(cellIndex)}</span>
          <span>{getYIndicatorLabelByindex(cellIndex)}</span>
        </div>
      </div>
    </div>
  );
};
