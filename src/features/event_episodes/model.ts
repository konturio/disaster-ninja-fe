import core from '~core/index';
import { episodesResource } from './atoms/episodesResource';
import { episodesTimeline } from './atoms/episodesTimeline';

export const eventEpisodesModel = {
  currentEventEpisodes: episodesResource, // List of episodes
  currentEpisode: core.sharedState.currentEpisodeAtom, // Selected episode
  episodesPanelState: core.sharedState.episodesPanelState, // Panel settings
  episodesTimelineState: episodesTimeline, // Timeline settings
};
