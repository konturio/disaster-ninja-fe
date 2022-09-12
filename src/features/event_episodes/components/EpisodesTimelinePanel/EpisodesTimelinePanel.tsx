import { Panel, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms/createStateMap';
import { i18n } from '~core/localization';
import { eventEpisodesController } from '../../controller';
import { eventEpisodesModel } from '../../model';
import { EpisodesTimeline } from '../EpisodesTimeline/EpisodesTimeline';

export function EpisodesTimelinePanel() {
  const [episodes] = useAtom(eventEpisodesModel.currentEventEpisodes);

  const statesToComponents = createStateMap({
    error: episodes.error,
    loading: episodes.loading,
    data: episodes,
  });

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Episode')}</Text>}
      onClose={eventEpisodesController.closeEpisodesTimeline}
    >
      <div>
        {statesToComponents({
          loading: (
            <LoadingSpinner marginTop="16px" message={i18n.t('loading_episodes')} />
          ),
          error: (errorMessage) => (
            <ErrorMessage marginTop="16px" message={errorMessage} />
          ),
          ready: (episodes) =>
            episodes.data ? (
              <EpisodesTimeline episodes={episodes.data} />
            ) : (
              <ErrorMessage marginTop="16px" message={'no_episodes'} />
            ),
        })}
      </div>
    </Panel>
  );
}
