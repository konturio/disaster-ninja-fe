import { Text } from '@k2-packages/ui-kit';
import { useMemo } from 'react';
import s from './Analytics.module.css';
import peopleIcon from './icons/people.svg';
import areaIcon from './icons/area.svg';
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
  icon?: string;
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
        icon: peopleIcon,
      });

    if (typeof affectedPeople === 'number')
      result.push({
        tooltip: i18n.t('Affected People'),
        value: formatNumber(affectedPeople),
        icon: peopleIcon,
      });

    if (typeof settledArea === 'number')
      result.push({
        tooltip: i18n.t('Settled Area'),

        value: (
          <span>
            {formatNumber(settledArea)} km<Sub>2</Sub>
          </span>
        ),
        icon: areaIcon,
      });

    if (typeof osmGapsPercentage === 'number')
      result.push({
        tooltip: i18n.t('OSM Gaps Percentage (lower is better)'),
        value: `${osmGapsPercentage}% gaps`,
      });

    if (typeof loss === 'number')
      result.push({
        tooltip: i18n.t('Estimated loss'),
        value: `$${formatNumber(loss)}% estimated loss`,
      });

    return result;
  }, [settledArea, affectedPeople, osmGapsPercentage]);

  return (
    <div className={s.analytics}>
      {statistics.map(({ tooltip, icon, value }) => (
        <div key={tooltip} className={s.analyticsBadge} title={tooltip}>
          {icon && <img className={s.analyticsIcon} src={icon}></img>}
          <span className={s.analyticsValue}>
            <Text type="caption">{value}</Text>
          </span>
        </div>
      ))}
    </div>
  );
}
