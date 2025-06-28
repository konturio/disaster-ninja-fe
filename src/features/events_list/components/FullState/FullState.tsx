import { useRef, useCallback, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { EventsPanelSettings } from '../EventsPanelSettings/EventsPanelSettings';
import s from './FullState.module.css';
import type { Event } from '~core/types';
import type { VirtuosoHandle } from 'react-virtuoso';

export function FullState({
  eventsList,
  currentEventId,
  renderEventCard,
  unlistedEvent,
}: {
  eventsList: Event[] | null;
  currentEventId: string | null;
  renderEventCard: (event: Event, isActive: boolean) => JSX.Element;
  unlistedEvent?: Event | null;
}) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Calculate current event index
  const currentEventIndex = useMemo(() => {
    if (!currentEventId || !eventsList) return undefined;
    return eventsList.findIndex((event) => event.eventId === currentEventId);
  }, [currentEventId, eventsList]);

  const itemContent = useCallback(
    (_: number, event: Event) => renderEventCard(event, event.eventId === currentEventId),
    [renderEventCard, currentEventId],
  );

  const hasEvents = eventsList && eventsList.length > 0;

  return (
    <div className={s.panelBody}>
      {unlistedEvent && renderEventCard(unlistedEvent, true)}
      <EventsPanelSettings />
      {hasEvents && (
        <div className={s.scrollable}>
          <Virtuoso
            ref={virtuosoRef}
            data={eventsList}
            totalCount={eventsList.length}
            initialTopMostItemIndex={{
              index: currentEventIndex || 0,
              align: 'center',
              behavior: 'auto',
            }}
            itemContent={itemContent}
          />
          <div className={s.height100vh} />
        </div>
      )}
    </div>
  );
}
