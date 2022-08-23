import { Text } from '@konturio/ui-kit';
import { useMemo } from 'react';
import { People16, Area16 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import s from './Analytics.module.css';

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
        tooltip: i18n.t('analytics.affected_people.tooltip'),
        value: i18n.t('analytics.affected_people.value'),
        icon: <People16 />,
      });

    if (typeof affectedPeople === 'number')
      result.push({
        tooltip: i18n.t('analytics.affected_people.tooltip'),
        value: formatNumber(affectedPeople),
        icon: <People16 />,
      });

    if (typeof settledArea === 'number')
      result.push({
        tooltip: i18n.t('analytics.settled_area.tooltip'),

        value: (
          <span>
            {formatNumber(settledArea)} km<Sub>2</Sub>
          </span>
        ),
        icon: <Area16 />,
      });

    if (typeof osmGapsPercentage === 'number')
      result.push({
        tooltip: i18n.t('analytics.osm_gaps_percentage.tooltip'),
        value: `${osmGapsPercentage}% gaps`,
      });

    if (typeof loss === 'number')
      result.push({
        tooltip: i18n.t('analytics.loss.tooltip'),
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
