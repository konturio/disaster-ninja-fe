import { Text } from '@k2-packages/ui-kit';
import { useMemo } from 'react';
import s from './Analytics.module.css';
import peopleIcon from './icons/people.svg';
import areaIcon from './icons/area.svg';
import mapIcon from './icons/map.svg';

const Sub = ({ children }) => (
  <span style={{ fontSize: '.7em', verticalAlign: 'super' }}>{children}</span>
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
    const formatNumber = new Intl.NumberFormat().format;
    return [
      {
        tooltip: 'Settled Area',
        value: formatNumber(settledArea),
        icon: areaIcon,
      },
      {
        tooltip: 'Affected People',
        value: (
          <span>
            {formatNumber(affectedPeople)} km<Sub>2</Sub>
          </span>
        ),
        icon: peopleIcon,
      },
      {
        tooltip: 'OSM Gaps Percentage (lower is better)',
        value: osmGapsPercentage ? `${osmGapsPercentage}%` : ' - ',
        icon: mapIcon,
      },
    ];
  }, [settledArea, affectedPeople, osmGapsPercentage]);

  return (
    <div className={s.analytics}>
      {statistics.map(({ tooltip, icon, value }) => (
        <div key={tooltip} className={s.analyticsBadge} title={tooltip}>
          <img className={s.analyticsIcon} src={icon}></img>
          <span className={s.analyticsValue}>
            <Text type="caption">{value}</Text>
          </span>
        </div>
      ))}
    </div>
  );
}
