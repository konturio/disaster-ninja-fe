import cn from 'clsx';
import { parseISO } from 'date-fns';
import { Disaster } from '~appModule/types';
import { Analytics } from './Analytics/Analytics';
import { SeverityIndicator } from './SeverityIndicator/SeverityIndicator';
import s from './DisasterCard.module.css';
import { Text } from '@k2-packages/ui-kit';

const formatTime = (() => {
  const format = new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format;
  return (date: Date) => format(date).replace(',', '');
})();

export function DisasterCard({
  disaster,
  isActive,
}: {
  disaster: Disaster;
  isActive: boolean;
}) {
  return (
    <button className={cn(s.disasterCard, { [s.active]: isActive })}>
      <div className={s.head}>
        <Text type="heading-m">{disaster.eventName}</Text>
        <SeverityIndicator severity={disaster.severity} />
      </div>

      <div className={s.locations}>
        <Text type="caption">{disaster.locations.join(', ')}</Text>
      </div>

      <Analytics
        settledArea={disaster.settledArea}
        affectedPeople={disaster.affectedPeople}
        osmGapsPercentage={disaster.osmGapsPercentage}
      />

      <div className={s.footer}>
        <Text type="caption">
          Updated {formatTime(parseISO(disaster.updatedAt))}
        </Text>
      </div>
    </button>
  );
}
