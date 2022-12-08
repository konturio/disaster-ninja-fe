import { Virtuoso } from 'react-virtuoso';
import { useAtom } from '@reatom/react';
import { useEffect, useRef } from 'react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { i18n } from '~core/localization';
import { AppFeature } from '~core/auth/types';
import { createStateMap } from '~utils/atoms';
import { eventListResourceAtom } from '~features/events_list/atoms/eventListResource';
import { userResourceAtom } from '~core/auth';
import { FeedSelector } from '../FeedSelector/FeedSelector';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { EventCard } from '../EventCard/EventCard';
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
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const virtuoso = useRef<VirtuosoHandle>(null);

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
      if (currentEventIndex > -1)
        ref.scrollToIndex({ index: currentEventIndex, align: 'center' });
    }
  }, [currentEventId, eventsList, virtuoso]);

  return (
    <div className={s.panelBody}>
      <EventListSettingsRow>
        <FeedSelector />
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
                    onClick={onCurrentChange}
                    alternativeActionControl={
                      userModel?.hasFeature(AppFeature.EPISODES_TIMELINE) ? (
                        <EpisodeTimelineToggle
                          isActive={event.eventId === currentEventId}
                        />
                      ) : null
                    }
                    externalUrls={event.externalUrls}
                  />
                )}
                ref={virtuoso}
              />
            </>
          ),
        })}
      </div>
    </div>
  );
}
