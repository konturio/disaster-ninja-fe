import { Virtuoso } from 'react-virtuoso';
import { useAtom } from '@reatom/react-v2';
import { useCallback, useMemo } from 'react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { i18n } from '~core/localization';
import { createStateMap } from '~utils/atoms';
import { eventListResourceAtom } from '~features/events_list/atoms/eventListResource';
import { useUnlistedRef } from '~utils/hooks/useUnlistedRef';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { FeedSelectorFlagged } from '../FeedSelector';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { EventCard } from '../EventCard/EventCard';
import { CurrentEvent } from '../CurrentEvent/CurrentEvent';
import s from './FullState.module.css';

const featureFlags = configRepo.get().features;

export function FullState({
  currentEventId,
  onCurrentChange,
}: {
  currentEventId?: string | null;
  onCurrentChange: (id: string) => void;
}) {
  const [{ data: eventsList, error, loading }] = useAtom(eventListResourceAtom);
  const hasTimeline = featureFlags[AppFeature.EPISODES_TIMELINE];

  const statesToComponents = createStateMap({
    error,
    loading: loading,
    data: eventsList,
  });

  const currentEventIndex = useMemo(() => {
    if (!currentEventId) return 0;
    if (eventsList === null || eventsList.length === 0) return 0;
    const index = eventsList.findIndex((event) => event.eventId === currentEventId);
    return Math.max(index, 0);
  }, [currentEventId, eventsList]);

  const eventListIncludesCurrentEvent: true | false | 'unknown' = useMemo(() => {
    if (error || loading || eventsList === null) return 'unknown';
    return !!eventsList.find((event) => event.eventId === currentEventId);
  }, [currentEventId, eventsList, error, loading]);

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

  return (
    <div className={s.panelBody}>
      {eventListIncludesCurrentEvent === false && (
        <CurrentEvent hasTimeline={Boolean(hasTimeline)} showDescription={true} />
      )}
      <EventListSettingsRow>
        <FeedSelectorFlagged />
        {featureFlags[AppFeature.EVENTS_LIST__BBOX_FILTER] && <BBoxFilterToggle />}
      </EventListSettingsRow>
      <div className={s.scrollable}>
        {statesToComponents({
          loading: <LoadingSpinner message={i18n.t('loading_events')} />,
          error: (errorMessage) => (
            <ErrorMessage message={errorMessage} containerClass={s.errorContainer} />
          ),
          ready: (eventsList) => (
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
                      hasTimeline && event.episodeCount > 1 ? (
                        <EpisodeTimelineToggle
                          isActive={event.eventId === currentEventId}
                        />
                      ) : null
                    }
                    externalUrls={event.externalUrls}
                    showDescription={event.eventId === currentEventId}
                  />
                )}
              />
              <div className={s.height100vh}>
                {/* it helps expand panel to full height
                despite that virtual element has no height
                without braking scroll */}
              </div>
            </>
          ),
        })}
      </div>
    </div>
  );
}
