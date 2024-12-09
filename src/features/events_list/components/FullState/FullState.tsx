import { useRef, useState, useCallback, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { FeedSelectorFlagged } from '../FeedSelector';
import { EventListSortButton } from '../EventListSortButton/EventListSortButton';
import s from './FullState.module.css';
import type { Event } from '~core/types';
import type { VirtuosoHandle } from 'react-virtuoso';

const featureFlags = configRepo.get().features;

export function FullState({
  eventsList,
  currentEventId,
  renderEventCard,
}: {
  eventsList: Event[] | null;
  currentEventId: string | null;
  renderEventCard: (event: Event, isActive: boolean) => JSX.Element;
}) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [sortedEvents, setSortedEvents] = useState<Event[] | null>(eventsList);

  // Calculate current event index based on sorted list
  const currentEventIndex = useMemo(() => {
    if (!currentEventId || !sortedEvents) return undefined;
    return sortedEvents.findIndex((event) => event.eventId === currentEventId);
  }, [currentEventId, sortedEvents]);

  const handleSort = useCallback(
    (order: 'asc' | 'desc') => {
      if (!sortedEvents || !currentEventId) return;

      const newSortedEvents = [...sortedEvents].sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });

      setSortedEvents(newSortedEvents);
    },
    [sortedEvents, currentEventId],
  );

  const handleFocus = useCallback(() => {
    if (currentEventIndex !== undefined && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: currentEventIndex,
        align: 'center',
        behavior: 'auto',
      });
    }
  }, [currentEventIndex]);

  const itemContent = useCallback(
    (_: number, event: Event) => renderEventCard(event, event.eventId === currentEventId),
    [renderEventCard, currentEventId],
  );

  if (!eventsList) return null;

  return (
    <div className={s.panelBody}>
      <EventListSettingsRow>
        <FeedSelectorFlagged />
        {featureFlags[AppFeature.EVENTS_LIST__BBOX_FILTER] && <BBoxFilterToggle />}
        <EventListSortButton
          onSort={handleSort}
          onFocus={currentEventIndex !== undefined ? handleFocus : undefined}
        />
      </EventListSettingsRow>
      <div className={s.scrollable}>
        <Virtuoso
          ref={virtuosoRef}
          data={sortedEvents || eventsList}
          totalCount={(sortedEvents || eventsList).length}
          initialTopMostItemIndex={{
            index: currentEventIndex || 0,
            align: 'center',
            behavior: 'auto',
          }}
          itemContent={itemContent}
        />
        <div className={s.height100vh} />
      </div>
    </div>
  );
}
