import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/app/types';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
import { isEpisodeGeometry } from '~core/focused_geometry/utils';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import type { EventWithGeometry } from '~core/types';

export const currentEventGeometryAtom = createAtom(
  {
    currentEventResourceAtom,
  },
  ({ onChange, schedule, getUnlistedState }, state: null | EventWithGeometry = null) => {
    onChange('currentEventResourceAtom', ({ error, loading, data }) => {
      if (!loading && !error && data) {
        state = data;
        const focusedGeometry = getUnlistedState(focusedGeometryAtom);
        if (
          // Episode and event can be selected at the same time,
          // in that case the geometry of the episode is more important
          !isEpisodeGeometry(focusedGeometry)
        ) {
          schedule((dispatch) => {
            dispatch(
              focusedGeometryAtom.setFocusedGeometry(
                {
                  type: 'event',
                  meta: data,
                },
                data.geojson,
              ),
            );
            dispatch(enabledLayersAtom.set(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID));
          });
        }
      }
      // Case resource didn't call for event because event id or feed id was absent
      else if (!loading && !error && data === null) {
        state = null;
      }

      // Feature considered ready after loading event or getting error when event not found
      if (!loading && (data || error)) {
        dispatchMetricsEventOnce(AppFeature.CURRENT_EVENT, !!data);
      }
    });
    return state;
  },
  'currentEventGeometry',
);
