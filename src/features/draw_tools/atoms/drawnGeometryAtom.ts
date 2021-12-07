// import { activeDrawModeAtom } from './activeDrawMode';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { FeatureCollection, Feature } from 'geojson';

const exampleGeo: Feature = {
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          53.24676749999969,
          73.844393544434
        ],
        [
          82.4967717915341,
          58.9228002926334
        ],
        [
          25.965515354232487,
          58.63121797209951
        ],
        [
          25.824892499999685,
          58.63121797209951
        ],
        [
          53.24676749999969,
          73.844393544434
        ]
      ]
    ]
  },
  "type": "Feature",
  "properties": {}
}

const defaultState: FeatureCollection = {
  type: 'FeatureCollection', features: []
}
// todo remove feature
export const drawnGeometryAtom = createBindAtom(
  {
    // activeDrawModeAtom,
    addFeature: (feature: Feature) => feature,
    sendToFocusedGeometry: () => null,
    updateFeature: (index: number, feature?: Feature) => { return { index, feature } }
  },
  ({ onChange, schedule, onAction }, state: FeatureCollection = defaultState) => {
    // onChange('activeDrawModeAtom', (mode) => {
    //   // if (!mode) state = [];
    // });

    onAction('addFeature', (feature) => {
      state = { ...state, features: [...state.features, feature] }
      console.log('%c⧭', 'color: #cc0036', state);
    });

    onAction('sendToFocusedGeometry', () => {
      schedule((dispatch) =>
        dispatch(
          focusedGeometryAtom.setFocusedGeometry(
            { type: 'custom' },
            state
          ),
        ),
      );
      state = defaultState
    })

    onAction('updateFeature', ({ index, feature }) => {
      if (!feature || !index) return;
      const newState = { ...state, features: [...state.features] }
      newState.features[index] = feature
      state = newState
    })


    return state;
  },
  'drawnGeometryAtom',
);
