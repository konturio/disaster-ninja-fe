import { useMemo } from 'react';
import cn from 'clsx';
import { parseISO } from 'date-fns';
import { Text } from '@konturio/ui-kit';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import core from '~core/index';
import { Analytics } from './Analytics/Analytics';
import s from './EventCard.module.css';
import type { Event } from '~core/types';

const formatTime = (() => {
  const format = new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZoneName: 'short',
  }).format;
  return (date: Date) => format(date);
})();

export function EventCard({
  event,
  isActive,
  onClick,
  alternativeActionControl,
}: {
  event: Event;
  isActive: boolean;
  onClick: (id: string) => void;
  alternativeActionControl: JSX.Element | null;
}) {
  const formattedTime = useMemo(
    () => formatTime(parseISO(event.updatedAt)),
    [event.updatedAt],
  );
  return (
    <button
      className={cn(s.eventCard, { [s.active]: isActive })}
      onClick={() => onClick(event.eventId)}
    >
      <div className={s.head}>
        <Text type="heading-m">{event.eventName}</Text>
        <SeverityIndicator severity={event.severity} />
      </div>

      <div className={s.location}>
        <Text type="caption">{event.location}</Text>
      </div>

      <Analytics
        settledArea={event.settledArea}
        affectedPeople={event.affectedPopulation}
        loss={event.loss}
      />

      <div className={s.footer}>
        <Text type="caption">{core.i18n.t('updated') + ` ${formattedTime}`}</Text>
        {alternativeActionControl}
      </div>
    </button>
  );
}
