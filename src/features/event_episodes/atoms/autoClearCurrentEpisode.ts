import { createAtom } from '~utils/atoms';
import { mergeFeatureCollection } from '~utils/geoJSON/helpers';
import { currentEpisodeAtom } from '~core/shared_state';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { episodesResource } from './episodesResource';
import type { Episode } from '~core/types';

/**
 * When episodes list changed - we need to actualize selection.
 * If selected episode not included in new list - selection must be cleared
 */
export const autoClearCurrentEpisode = createAtom(
  {
    episodesResource,
  },
  ({ onChange, get, schedule, getUnlistedState }, state: null | Episode = null) => {
    onChange('episodesResource', (resource) => {
      const episodesResource = get('episodesResource');
      if (episodesResource.loading || episodesResource.error) return;
      const selection = getUnlistedState(currentEpisodeAtom);
      if (selection === null) return;

      const episodes = episodesResource.data || [];
      const selectionInNewList = episodes.find((e) => e.id === selection.id);
      if (!selectionInNewList) {
        schedule((dispatch) => {
          dispatch(currentEpisodeAtom.reset());
        });
      }
    });
  },
  'autoClearCurrentEpisode',
);
