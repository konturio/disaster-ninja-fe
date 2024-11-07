import { EditLine24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { convertDirectionsArrayToLabel } from '~utils/bivariate';
import s from './LegendDetails.module.css';
import type { Direction } from '~utils/bivariate';

type LegendDetailsProps = {
  label: string;
  direction: Direction;
  mostQualityDenominator?: string;
};

export const LegendDetails = ({
  label,
  mostQualityDenominator,
  direction,
}: LegendDetailsProps) => (
  <div>
    <div className={s.LegendDetailsLabel}>
      {label +
        (mostQualityDenominator ? ` ${i18n.t('to')} ${mostQualityDenominator}` : '')}
    </div>
    <div className={s.LegendDetailsDirection}>
      {convertDirectionsArrayToLabel(direction)}
      <EditLine24 width={16} height={16} />
    </div>
  </div>
);
