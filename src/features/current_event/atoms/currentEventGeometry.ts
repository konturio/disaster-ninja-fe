import { createAtom } from '~core/store/atoms';
import core from '~core/index';
import { currentEventResourceAtom } from './currentEventResource';
import type { EventWithGeometry } from '~core/types';

export const currentEventGeometryAtom = createAtom(
  {
    currentEventResourceAtom,
  },
  ({ onChange, schedule }, state: null | EventWithGeometry = null) => {
    onChange('currentEventResourceAtom', ({ error, loading, data }) => {
      if (!loading && !error && data) {
        state = data;
        schedule((dispatch) => {
          dispatch(
            core.sharedState.focusedGeometryAtom.setFocusedGeometry(
              {
                type: 'event',
                meta: data,
              },
              data.geojson,
            ),
          );
        });
      }
      // Case resource didn't call for event because event id or feed id was absent
      else if (!loading && !error && data === null) {
        state = null;
      }
    });
    return state;
  },
  'currentEventGeometry',
);
