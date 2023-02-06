import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/auth/types';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
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
          focusedGeometry === null || // Initial
          focusedGeometry.source.type === 'event' // Auto refreshes
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
