import { createAtom } from '~utils/atoms';
import { episodesPanelState } from '~core/shared_state/episodesPanelState';
import { episodesResource } from './episodesResource';

/**
 * Close episodes timeline when selected event has one or no episodes.
 */
export const autoCloseEpisodesPanel = createAtom(
  {
    episodesResource,
  },
  ({ onChange, get, getUnlistedState, schedule }) => {
    onChange('episodesResource', () => {
      const resource = get('episodesResource');
      if (resource.loading || resource.error) return;
      const episodes = resource.data || [];
      const panelState = getUnlistedState(episodesPanelState);
      if (panelState.isOpen && episodes.length <= 1) {
        schedule((dispatch) => {
          dispatch(episodesPanelState.close());
        });
      }
    });
  },
  'autoCloseEpisodesPanel',
);
