import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { currentEventResourceAtom } from './currentEventResource';

export const currentEventGeometry = createBindAtom(
  {
    currentEventResourceAtom,
    focusedGeometryAtom,
  },
  ({ onChange }) => {
    onChange('currentEventResourceAtom', ({ error, loading, data }) => {
      if (!loading && !error && data) {
        focusedGeometryAtom.setFocusedGeometry.dispatch(
          {
            type: 'event',
            meta: data,
          },
          data.geojson,
        );
      }
    });
  },
  'currentEventGeometry',
);
