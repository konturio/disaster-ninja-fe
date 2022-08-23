import clsx from 'clsx';
import { Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { BivariateLegend as BivariateLegendComponent } from '~components/BivariateLegend/BivariateLegend';
import { formatSentimentDirection } from '~utils/bivariate';
import s from './LegendWithMap.module.css';
import { LegendDetails } from './LegendDetails';
import type {
  BivariateColorManagerDataValue,
  TableDataValue,
} from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type { Axis } from '~utils/bivariate';

export type LayerSelectionFull = {
  key: string;
  vertical: TableDataValue;
  horizontal: TableDataValue;
};

export type LegendWithMapProps = {
  selectedData: BivariateColorManagerDataValue;
  layersSelection: LayerSelectionFull;
};

export const LegendWithMap = ({
  selectedData,
  layersSelection,
}: LegendWithMapProps) => {
  const { legend, directions } = selectedData;
  const { horizontal, vertical } = layersSelection;
  const verticalMostQualityDenominator = vertical?.mostQualityDenominator;
  const horizontalMostQualityDenominator = horizontal?.mostQualityDenominator;
  const horizontalLabel = horizontal?.label;
  const verticalLabel = vertical?.label;

  const meta = {
    hints: {
      y: {
        label: horizontalLabel,
        direction: directions.horizontal,
      },
      x: {
        label: verticalLabel,
        direction: directions.vertical,
      },
    },
  };

  const renderXAxisLabel = (_bivAxis: Axis, rootClassName: string) => (
    <div className={clsx(rootClassName, s.xAxisLabel)}>
      <div className={s.axisDirectionLabel}>
        {directions.horizontal.map((direction, i) => (
          <div key={i}>{formatSentimentDirection(direction)}</div>
        ))}
      </div>
      {horizontalLabel}
    </div>
  );

  const renderYAxisLabel = (_bivAxis: Axis, rootClassName: string) => (
    <div className={clsx(rootClassName, s.yAxisLabel)}>
      {verticalLabel}
      <div className={s.axisDirectionLabel}>
        {directions.vertical.map((direction, i) => (
          <div key={i}>{formatSentimentDirection(direction)}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={s.legendWithMapContainer}>
      <Text type="heading-m">{i18n.t('legend_presentation')}</Text>

      <BivariateLegendComponent
        showDescription={false}
        meta={meta}
        legend={legend}
        showSteps={false}
        showArrowHeads={false}
        renderXAxisLabel={renderXAxisLabel}
        renderYAxisLabel={renderYAxisLabel}
      />

      <div className={s.LegendDetailsContainer}>
        <LegendDetails
          label={verticalLabel}
          mostQualityDenominator={verticalMostQualityDenominator}
          direction={directions.vertical}
        />
        <LegendDetails
          label={horizontalLabel}
          mostQualityDenominator={horizontalMostQualityDenominator}
          direction={directions.horizontal}
        />
      </div>
    </div>
  );
};
