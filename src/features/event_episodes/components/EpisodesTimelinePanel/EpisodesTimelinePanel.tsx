import { Panel } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms/createStateMap';
import { i18n } from '~core/localization';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { panelClasses } from '~components/Panel';
import { eventEpisodesController } from '../../controller';
import { eventEpisodesModel } from '../../model';
import { EpisodesTimeline } from '../EpisodesTimeline/EpisodesTimeline';
import s from './EpisodesTimelinePanel.module.css';

export function EpisodesTimelinePanel() {
  const [episodes] = useAtom(eventEpisodesModel.currentEventEpisodes);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const statesToComponents = createStateMap(
    {
      error: episodes.error,
      loading: episodes.loading,
      data: episodes,
    },
    { loadingStateDelayMs: 500 },
  );

  return (
    <Panel
      header={String(i18n.t('episode'))}
      onHeaderClick={eventEpisodesController.closeEpisodesTimeline}
      modal={{
        onModalClick: eventEpisodesController.closeEpisodesTimeline,
        showInModal: isMobile,
      }}
      classes={{ ...panelClasses, modal: s.episodesModal }}
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
