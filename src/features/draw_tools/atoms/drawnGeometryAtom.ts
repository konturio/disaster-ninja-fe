import { activeDrawModeAtom } from './activeDrawMode';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { Feature } from 'geojson';

// todo remove feature
export const drawnGeometryAtom = createBindAtom(
  {
    activeDrawModeAtom,
    addFeature: (feature: Feature) => feature,
  },
  ({ onChange, schedule, onAction }, state: Feature[] = []) => {
    onChange('activeDrawModeAtom', (mode) => {
      if (!mode) state = [];
    });
    onAction('addFeature', (feature) => {
      state = [...state, feature];
      console.log('%c⧭', 'color: #cc0036', state);
      schedule((dispatch) =>
        dispatch(
          focusedGeometryAtom.setFocusedGeometry(
            { type: 'custom' },
            { type: 'FeatureCollection', features: state },
          ),
        ),
      );
    });

    return state;
  },
  'drawnGeometryAtom',
);
