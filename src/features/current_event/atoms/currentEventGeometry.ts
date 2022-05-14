import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/shared_state';
import { currentEventResourceAtom } from './currentEventResource';
import { EventWithGeometry } from '~core/types';

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
      // Case resource didn't call for event because event id or feed id was absent
      else if (!loading && !error && data === null) {
        state = null;
      }
    });
    return state;
  },
  'currentEventGeometry',
);
