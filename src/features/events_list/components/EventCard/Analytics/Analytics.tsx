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

export function Analytics({
  settledArea,
  affectedPeople,
  osmGapsPercentage,
}: {
  settledArea: number;
  affectedPeople: number;
  osmGapsPercentage: number | null;
}) {
  const statistics = useMemo(() => {
    if (affectedPeople === 0)
      return [
        {
          tooltip: i18n.t('Affected People'),
          value: i18n.t('No humanitarian impact'),
          icon: peopleIcon,
        },
      ];

    if (!affectedPeople)
      return [
        {
          tooltip: i18n.t('Affected People'),
          value: i18n.t('No data'),
          icon: peopleIcon,
        },
      ];

    const formatNumber = new Intl.NumberFormat().format;
    return [
      {
        tooltip: i18n.t('Affected People'),
        value: formatNumber(affectedPeople),
        icon: peopleIcon,
      },
      {
        tooltip: i18n.t('Settled Area'),

        value: (
          <span>
            {formatNumber(settledArea)} km<Sub>2</Sub>
          </span>
        ),
        icon: areaIcon,
      },
      {
        tooltip: i18n.t('OSM Gaps Percentage (lower is better)'),
        value: osmGapsPercentage ? `${osmGapsPercentage}% gaps` : ' - ',
      },
    ];
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
