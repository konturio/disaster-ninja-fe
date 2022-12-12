import { Button, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { useEffect, useState } from 'react';
import { i18n } from '~core/localization';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
import { eventListResourceAtom } from '~features/events_list/atoms/eventListResource';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { EventCard } from '../EventCard/EventCard';
import { CurrentEvent } from '../CurrentEvent/CurrentEvent';
import s from './ShortState.module.css';
import type { MouseEventHandler } from 'react';
import type { Event } from '~core/types';

const SingleEventCard = ({
  event,
  hasTimeline,
}: {
  event: Event;
  hasTimeline?: boolean;
}) => (
  <EventCard
    event={event}
    isActive={true}
    alternativeActionControl={
      hasTimeline ? <EpisodeTimelineToggle isActive={true} /> : null
    }
    externalUrls={event.externalUrls}
  />
);

export function ShortState({
  hasTimeline,
  openFullState,
  currentEventId,
}: {
  hasTimeline?: boolean;
  openFullState: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  currentEventId?: string | null;
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [{ data: currentEvent }] = useAtom(currentEventResourceAtom);
  const [eventsList] = useAtom(eventListResourceAtom);

  // Try get event from event list
  useEffect(() => {
    if (!event && currentEventId && eventsList.data) {
      const eventFromList = eventsList.data.find((ev) => ev.eventId === currentEventId);
      if (eventFromList) setEvent(eventFromList);
    } else if (event && currentEventId === null) setEvent(null);
  }, [eventsList, currentEventId, setEvent]);

  // Try get event from currentEventResourceAtom
  useEffect(() => {
    if (!event && currentEvent) setEvent(currentEvent);
  }, [currentEvent, event, setEvent]);

  const eventInfo = event ? (
    <SingleEventCard event={event} hasTimeline={hasTimeline} />
  ) : (
    <CurrentEvent hasTimeline={hasTimeline} />
  );

  const panelContent = eventInfo || (
    <div className={s.noDisasters}>
      <div className={s.noDisasterMsg}>
        <Text type="short-l">{i18n.t('event_list.no_selected_disaster')}</Text>
      </div>
      <div className={s.callToAction}>
        <Button variant="invert" size="small" onClick={openFullState}>
          <Text type="short-m">{i18n.t('event_list.chose_disaster')}</Text>
        </Button>
      </div>
    </div>
  );

  return <div className={s.shortPanel}>{panelContent}</div>;
}
