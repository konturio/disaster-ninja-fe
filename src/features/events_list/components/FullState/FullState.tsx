import { useAtom } from '@reatom/react-v2';
import { useCallback, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { useUnlistedRef } from '~utils/hooks/useUnlistedRef';
import { eventListResourceAtom } from '../../atoms/eventListResource';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { CurrentEvent } from '../CurrentEvent/CurrentEvent';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { EventCard } from '../EventCard/EventCard';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { FeedSelectorFlagged } from '../FeedSelector';
import s from './FullState.module.css';
import type { Event } from '~core/types';

const featureFlags = configRepo.get().features;

const findEventById = (eventsList: Event[] | null, eventId?: string | null) => {
  if (!eventId || !eventsList?.length) return null;
  return eventsList.find((event) => event.eventId === eventId);
};

const shouldShowTimeline = (event: Event, hasTimeline: boolean): boolean => {
  return hasTimeline && event.episodeCount > 1;
};

export function FullState({
  currentEventId,
  onCurrentChange,
}: {
  currentEventId?: string | null;
  onCurrentChange: (id: string) => void;
}) {
  const [{ data: eventsList, error, loading }] = useAtom(eventListResourceAtom);
  const hasTimeline = !!featureFlags[AppFeature.EPISODES_TIMELINE];

  const currentEvent = useMemo(
    () => findEventById(eventsList, currentEventId),
    [eventsList, currentEventId],
  );

  const currentEventIndex = useMemo(
    () =>
      Math.max(
        eventsList?.findIndex((event) => event.eventId === currentEventId) ?? -1,
        0,
      ),
    [currentEventId, eventsList],
  );

  const unlistedState = useUnlistedRef({ currentEventId });

  const eventClickHandler = useCallback(
    (id: string) => {
      const { currentEventId } = unlistedState.current;
      if (id !== currentEventId) {
        onCurrentChange(id);
      }
    },
    [onCurrentChange, unlistedState],
  );

  const renderEventList = () => {
    if (loading) return <LoadingSpinner message={i18n.t('loading_events')} />;
    if (error) return <ErrorMessage message={error} containerClass={s.errorContainer} />;
    if (!eventsList) return null;

    return (
      <>
        <Virtuoso
          data={eventsList}
          initialTopMostItemIndex={currentEventIndex}
          itemContent={(index, event) => (
            <EventCard
              key={event.eventId}
              event={event}
              isActive={event.eventId === currentEventId}
              onClick={eventClickHandler}
              alternativeActionControl={
                shouldShowTimeline(event, hasTimeline) ? (
                  <EpisodeTimelineToggle isActive={event.eventId === currentEventId} />
                ) : null
              }
              externalUrls={event.externalUrls}
              showDescription={event.eventId === currentEventId}
            />
          )}
        />
        <div className={s.height100vh} />
      </>
    );
  };

  return (
    <div className={s.panelBody}>
      {!currentEvent && currentEventId && (
        <CurrentEvent hasTimeline={hasTimeline} showDescription={true} />
      )}
      <EventListSettingsRow>
        <FeedSelectorFlagged />
        {featureFlags[AppFeature.EVENTS_LIST__BBOX_FILTER] && <BBoxFilterToggle />}
      </EventListSettingsRow>
      <div className={s.scrollable}>{renderEventList()}</div>
    </div>
  );
}
