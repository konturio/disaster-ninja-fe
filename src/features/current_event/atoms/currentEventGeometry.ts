import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { currentEventResourceAtom } from './currentEventResource';
import { EventWithGeometry } from '~core/types';

export const currentEventGeometryAtom = createBindAtom(
  {
    currentEventResourceAtom,
    focusedGeometryAtom,
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
    });
    return state;
  },
  'currentEventGeometry',
);
