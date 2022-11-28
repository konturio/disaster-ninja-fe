import { Button, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import noop from 'lodash/noop';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { i18n } from '~core/localization';
import { currentEventResourceAtom } from '~features/current_event/atoms/currentEventResource';
import { createStateMap } from '~utils/atoms';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { EventCard } from '../EventCard/EventCard';
import s from './ShortPanel.module.css';
import type { MouseEventHandler } from 'react';

export function ShortPanel({
  hasTimeline,
  openFullState,
}: {
  hasTimeline?: boolean;
  openFullState: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}) {
  const [{ data: currentEvent, error, loading }] = useAtom(currentEventResourceAtom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data: currentEvent,
  });

  const panelContent = statesToComponents({
    loading: <LoadingSpinner message={i18n.t('loading_events')} />,
    error: (errorMessage) => <ErrorMessage message={errorMessage} />,
    ready: (currentEvent) => (
      <EventCard
        event={currentEvent}
        isActive={true}
        onClick={noop}
        alternativeActionControl={
          hasTimeline ? <EpisodeTimelineToggle isActive={true} /> : null
        }
      />
    ),
  }) || (
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
