import { createAtom } from '~utils/atoms';
import { mergeFeatureCollection } from '~utils/geoJSON/helpers';
import { focusedGeometryAtom, currentEpisodeAtom } from '~core/shared_state';
import { episodesResource } from './episodesResource';
import type { Episode } from '~core/types';

export const episodeToFocusedGeometry = createAtom(
  {
    currentEpisodeAtom,
    episodesResource,
  },
  ({ onChange, get, schedule }, state: null | Episode = null) => {
    onChange('currentEpisodeAtom', (selection) => {
      if (!selection) return;
      const episodesResource = get('episodesResource');
      if (episodesResource.loading || episodesResource.error) return;
      if (episodesResource.data === null) {
        state = null;
        return;
      }
      const currentEpisodeData = episodesResource.data.find(
        (e) => e.id === selection?.id,
      );
      if (currentEpisodeData?.geojson === undefined) return;

      state = currentEpisodeData;

      const focusedGeometry = mergeFeatureCollection(currentEpisodeData.geojson);

      schedule((dispatch) => {
        dispatch(
          focusedGeometryAtom.setFocusedGeometry(
            {
              type: 'episode',
              meta: currentEpisodeData,
            },
            focusedGeometry,
          ),
        );
      });
    });
    return state;
  },
  'currentEventGeometry',
);
