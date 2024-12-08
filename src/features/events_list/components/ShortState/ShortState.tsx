import { Button, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { useEffect, useState } from 'react';
import { i18n } from '~core/localization';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
import { eventListResourceAtom } from '../../atoms/eventListResource';
import { CurrentEvent } from '../CurrentEvent/CurrentEvent';
import s from './ShortState.module.css';
import type { MouseEventHandler } from 'react';
import type { Event } from '~core/types';

const findEventInList = (
  eventsList: Event[] | null,
  eventId: string | undefined | null,
): Event | null => {
  if (!eventId || !eventsList?.length) return null;
  return eventsList.find((ev) => ev.eventId === eventId) ?? null;
};

const NoDisasterMessage = ({
  onOpenFullState,
}: {
  onOpenFullState: MouseEventHandler;
}) => (
  <div className={s.noDisasters}>
    <div className={s.noDisasterMsg}>
      <Text type="short-l">{i18n.t('event_list.no_selected_disaster')}</Text>
    </div>
    <div className={s.callToAction}>
      <Button variant="invert" size="small" onClick={onOpenFullState}>
        <Text type="short-m">{i18n.t('event_list.chose_disaster')}</Text>
      </Button>
    </div>
  </div>
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
  const [{ data: eventsList }] = useAtom(eventListResourceAtom);

  useEffect(() => {
    // Reset event when currentEventId is null
    if (currentEventId === null) {
      setEvent(null);
      return;
    }

    // Try to find event in list or use current event
    if (!event) {
      const eventFromList = eventsList && findEventInList(eventsList, currentEventId);
      if (eventFromList) {
        setEvent(eventFromList);
      } else if (currentEvent) {
        setEvent(currentEvent);
      }
    }
  }, [eventsList, currentEventId, currentEvent, event]);

  const renderContent = () => {
    if (event) {
      return <CurrentEvent hasTimeline={Boolean(hasTimeline)} showDescription={true} />;
    }
    return <NoDisasterMessage onOpenFullState={openFullState} />;
  };

  return <div className={s.shortPanel}>{renderContent()}</div>;
}
