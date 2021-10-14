import cn from 'clsx';
import { parseISO } from 'date-fns';
import { Event } from '~appModule/types';
import { Analytics } from './Analytics/Analytics';
import { SeverityIndicator } from './SeverityIndicator/SeverityIndicator';
import s from './EventCard.module.css';
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

export function EventCard({
  event,
  isActive,
  onClick,
}: {
  event: Event;
  isActive: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      className={cn(s.eventCard, { [s.active]: isActive })}
      onClick={() => onClick(event.eventId)}
    >
      <div className={s.head}>
        <Text type="heading-m">{event.eventName}</Text>
        <SeverityIndicator severity={event.severity} />
      </div>

      <div className={s.locations}>
        <Text type="caption">{event.locations}</Text>
      </div>

      <Analytics
        settledArea={event.settledArea}
        affectedPeople={event.affectedPopulation}
        osmGapsPercentage={event.osmGaps}
      />

      <div className={s.footer}>
        <Text type="caption">
          Updated {formatTime(parseISO(event.updatedAt))}
        </Text>
      </div>
    </button>
  );
}
