import { Text } from '@konturio/ui-kit';
import { useMemo } from 'react';
import { People16, Area16 } from '@konturio/default-icons';
import { nanoid } from 'nanoid';
import { SimpleTooltip } from '@konturio/floating';
import { i18n } from '~core/localization';
import s from './Analytics.module.css';

const Sub = ({ children }) => (
  <span style={{ fontSize: '.7em', verticalAlign: 'super', lineHeight: 0 }}>
    {children}
  </span>
);

const formatNumber = new Intl.NumberFormat().format;

type StatisticProps = {
  tooltip: string;
  value: string | JSX.Element | null;
  icon?: JSX.Element;
};

function Statistic({ tooltip, value, icon }: StatisticProps) {
  return (
    <SimpleTooltip content={tooltip} placement="bottom">
      <div className={s.analyticsBadge}>
        {icon && icon}
        <div>
          <Text type="caption">{value}</Text>
        </div>
      </div>
    </SimpleTooltip>
  );
}

export function Analytics({
  settledArea,
  affectedPeople,
  loss,
}: {
  settledArea: number;
  affectedPeople: number;
  loss?: number;
}) {
  const statistics = useMemo((): StatisticProps[] => {
    const result: StatisticProps[] = [];

    if (affectedPeople === 0)
      result.push({
        tooltip: i18n.t('event_list.analytics.affected_people.tooltip'),
        value: i18n.t('event_list.analytics.affected_people.value'),
        icon: <People16 />,
      });

    if (typeof affectedPeople === 'number')
      result.push({
        tooltip: i18n.t('event_list.analytics.affected_people.tooltip'),
        value: formatNumber(affectedPeople),
        icon: <People16 />,
      });

    if (typeof settledArea === 'number')
      result.push({
        tooltip: i18n.t('event_list.analytics.settled_area_tooltip'),

        value: (
          <span>
            {formatNumber(settledArea)} km<Sub>2</Sub>
          </span>
        ),
        icon: <Area16 />,
      });

    if (typeof loss === 'number')
      result.push({
        tooltip: i18n.t('event_list.analytics.loss_tooltip'),
        value: `$${formatNumber(loss)} estimated loss`,
      });

    return result;
  }, [settledArea, affectedPeople]);

  return (
    <div className={s.analytics}>
      {statistics.map((props) => (
        <Statistic key={nanoid(5)} {...props} />
      ))}
    </div>
  );
}
