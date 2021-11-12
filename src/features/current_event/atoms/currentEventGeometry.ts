import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { currentEventResourceAtom } from './currentEventResource';

export const currentEventGeometry = createBindAtom(
  {
    currentEventResourceAtom,
    focusedGeometryAtom,
  },
  ({ onChange, schedule }) => {
    onChange('currentEventResourceAtom', ({ error, loading, data }) => {
      if (!loading && !error && data) {
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
  },
  'currentEventGeometry',
);
