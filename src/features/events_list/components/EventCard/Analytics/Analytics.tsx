import { Text } from '@k2-packages/ui-kit';
import { useMemo } from 'react';
import s from './Analytics.module.css';
import { People16, Area16 } from '@k2-packages/default-icons';
import { TranslationService as i18n } from '~core/localization';

const Sub = ({ children }) => (
  <span style={{ fontSize: '.7em', verticalAlign: 'super', lineHeight: 0 }}>
    {children}
  </span>
);

const formatNumber = new Intl.NumberFormat().format;

type Statistics = {
  tooltip: string;
  value: string | JSX.Element | null;
  icon?: JSX.Element;
}[];

export function Analytics({
  settledArea,
  affectedPeople,
  osmGapsPercentage,
  loss,
}: {
  settledArea: number;
  affectedPeople: number;
  osmGapsPercentage: number | null;
  loss?: number;
}) {
  const statistics = useMemo((): Statistics => {
    const result: Statistics = [];

    if (affectedPeople === 0)
      result.push({
        tooltip: i18n.t('Affected People'),
        value: i18n.t('No humanitarian impact'),
        icon: <People16 />,
      });

    if (typeof affectedPeople === 'number')
      result.push({
        tooltip: i18n.t('Affected People'),
        value: formatNumber(affectedPeople),
        icon: <People16 />,
      });

    if (typeof settledArea === 'number')
      result.push({
        tooltip: i18n.t('Settled Area'),

        value: (
          <span>
            {formatNumber(settledArea)} km<Sub>2</Sub>
          </span>
        ),
        icon: <Area16 />,
      });

    if (typeof osmGapsPercentage === 'number')
      result.push({
        tooltip: i18n.t('OSM Gaps Percentage (lower is better)'),
        value: `${osmGapsPercentage}% gaps`,
      });

    if (typeof loss === 'number')
      result.push({
        tooltip: i18n.t('Estimated loss'),
        value: `$${formatNumber(loss)} estimated loss`,
      });

    return result;
  }, [settledArea, affectedPeople, osmGapsPercentage]);

  return (
    <div className={s.analytics}>
      {statistics.map(({ tooltip, icon, value }) => (
        <div key={tooltip} className={s.analyticsBadge} title={tooltip}>
          {icon && icon}
          <span className={s.analyticsValue}>
            <Text type="caption">{value}</Text>
          </span>
        </div>
      ))}
    </div>
  );
}
