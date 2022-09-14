import { currentEpisodeAtom, episodesPanelState } from '~core/shared_state';
import { createFeatureController } from '~utils/atoms/createController';
import { episodesTimeline } from './atoms/episodesTimeline';

export const eventEpisodesController = createFeatureController({
  setCurrentEpisode: (episodeId: string) => currentEpisodeAtom.set(episodeId),
  resetCurrentEpisode: () => currentEpisodeAtom.reset(),
  closeEpisodesTimeline: () => episodesPanelState.close(),
  openEpisodesTimeline: () => episodesPanelState.open(),
  resetTimelineZoom: () => episodesTimeline.resetZoom(),
  toggleTimelinePacking: () => episodesTimeline.patchSettings({ stack: true }),
  setTimelineImperativeApi: (api) => episodesTimeline.setImperativeApi(api),
});
