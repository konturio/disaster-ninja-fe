import core from '~core/index';
import { createFeatureController } from '~core/store/atoms/createController';
import { episodesTimeline } from './atoms/episodesTimeline';

export const eventEpisodesController = createFeatureController({
  setCurrentEpisode: (episodeId: string) => core.sharedState.currentEpisodeAtom.set(episodeId),
  resetCurrentEpisode: () => core.sharedState.currentEpisodeAtom.reset(),
  closeEpisodesTimeline: () => core.sharedState.episodesPanelState.close(),
  openEpisodesTimeline: () => core.sharedState.episodesPanelState.open(),
  resetTimelineZoom: () => episodesTimeline.resetZoom(),
  toggleTimelinePacking: () => episodesTimeline.patchSettings({ stack: true }),
  setTimelineImperativeApi: (api) => episodesTimeline.setImperativeApi(api),
});
