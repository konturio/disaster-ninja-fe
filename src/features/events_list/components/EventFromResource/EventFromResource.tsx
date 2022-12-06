import { useAtom } from '@reatom/react';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { i18n } from '~core/localization';
import { currentEventResourceAtom } from '~features/current_event/atoms/currentEventResource';
import { createStateMap } from '~utils/atoms';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { EventCard } from '../EventCard/EventCard';

export function EventFromResource({ hasTimeline }: { hasTimeline?: boolean }) {
  const [{ data, error, loading }] = useAtom(currentEventResourceAtom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data,
  });

  return statesToComponents({
    loading: <LoadingSpinner message={i18n.t('loading_events')} />,
    error: (errorMessage) => <ErrorMessage message={errorMessage} />,
    ready: (event) => (
      <EventCard
        key={event.eventId}
        event={event}
        isActive={true}
        alternativeActionControl={
          hasTimeline ? <EpisodeTimelineToggle isActive={true} /> : null
        }
        externalUrls={event.externalUrls}
      />
    ),
  });
}
