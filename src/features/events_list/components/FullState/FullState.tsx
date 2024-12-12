import { useRef, useCallback, useMemo } from 'react';
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
  onSort,
}: {
  eventsList: Event[] | null;
  currentEventId: string | null;
  renderEventCard: (event: Event, isActive: boolean) => JSX.Element;
  onSort: (order: 'asc' | 'desc') => void;
}) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Calculate current event index
  const currentEventIndex = useMemo(() => {
    if (!currentEventId || !eventsList) return undefined;
    return eventsList.findIndex((event) => event.eventId === currentEventId);
  }, [currentEventId, eventsList]);

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
        {/* <EventListSortButton
          onSort={onSort}
          onFocus={currentEventIndex !== undefined ? handleFocus : undefined}
        /> */}
      </EventListSettingsRow>
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
    </div>
  );
}
