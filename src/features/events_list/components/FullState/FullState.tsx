import { Virtuoso } from 'react-virtuoso';
import { useAtom } from '@reatom/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { i18n } from '~core/localization';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import { createStateMap } from '~utils/atoms';
import { eventListResourceAtom } from '~features/events_list/atoms/eventListResource';
import { FeedSelectorFlagged } from '../FeedSelector';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { EventCard } from '../EventCard/EventCard';
import { CurrentEvent } from '../CurrentEvent/CurrentEvent';
import s from './FullState.module.css';
import type { VirtuosoHandle } from 'react-virtuoso';

export function FullState({
  currentEventId,
  onCurrentChange,
}: {
  currentEventId?: string | null;
  onCurrentChange: (id: string) => void;
}) {
  const [{ data: eventsList, error, loading }] = useAtom(eventListResourceAtom);
  const [featureFlags] = useAtom(featureFlagsAtom);
  const hasTimeline = featureFlags[FeatureFlag.EPISODES_TIMELINE];
  const virtuoso = useRef<VirtuosoHandle>(null);

  const [hasUnlistedEvent, setHasUnlistedEvent] = useState(false);

  const statesToComponents = createStateMap({
    error,
    loading,
    data: eventsList,
  });

  // Virtual event list rendering effect
  useEffect(() => {
    const ref = virtuoso.current;
    if (ref && currentEventId && eventsList?.length) {
      const currentEventIndex = eventsList.findIndex(
        (event) => event.eventId === currentEventId,
      );
      // behavior: 'smooth' breaks this method as documentation warns https://virtuoso.dev/scroll-to-index
      if (currentEventIndex > -1) {
        ref.scrollToIndex({ index: currentEventIndex, align: 'center' });
        setHasUnlistedEvent(false);
      } else {
        setHasUnlistedEvent(true);
      }
    }
  }, [currentEventId, eventsList, virtuoso, setHasUnlistedEvent]);

  const currentEventRef = useRef(currentEventId);
  currentEventRef.current = currentEventId;
  const eventClickHandler = useCallback(
    (id: string) => {
      if (id !== currentEventRef.current) {
        onCurrentChange(id);
      }
    },
    [onCurrentChange, currentEventRef],
  );

  return (
    <div className={s.panelBody}>
      {hasUnlistedEvent && (
        <CurrentEvent hasTimeline={Boolean(hasTimeline)} showDescription={true} />
      )}
      <EventListSettingsRow>
        <FeedSelectorFlagged />
        <BBoxFilterToggle />
      </EventListSettingsRow>
      <div className={s.scrollable}>
        {statesToComponents({
          loading: <LoadingSpinner message={i18n.t('loading_events')} />,
          error: (errorMessage) => <ErrorMessage message={errorMessage} />,
          ready: (eventsList) => (
            <>
              <Virtuoso
                data={eventsList}
                itemContent={(index, event) => (
                  <EventCard
                    key={event.eventId}
                    event={event}
                    isActive={event.eventId === currentEventId}
                    onClick={eventClickHandler}
                    alternativeActionControl={
                      hasTimeline ? (
                        <EpisodeTimelineToggle
                          isActive={event.eventId === currentEventId}
                        />
                      ) : null
                    }
                    externalUrls={event.externalUrls}
                    showDescription={event.eventId === currentEventId}
                  />
                )}
                ref={virtuoso}
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
