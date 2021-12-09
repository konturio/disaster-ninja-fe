import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { FeatureCollection, Feature } from 'geojson';


const defaultState: FeatureCollection = {
  type: 'FeatureCollection', features: []
}

export const drawnGeometryAtom = createBindAtom(
  {
    addFeature: (feature: Feature) => feature,
    sendToFocusedGeometry: () => null,
    updateFeatures: (features: Feature[]) => features,
    removeByIndexes: (indexes: number[]) => indexes,
  },
  ({ schedule, onAction, create }, state: FeatureCollection = defaultState) => {

    onAction('addFeature', (feature) => {
      state = { ...state, features: [...state.features, feature] }
      
      schedule(dispatch => dispatch(create('sendToFocusedGeometry')))
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
    })

    onAction('updateFeatures', (features) => {
      state = { ...state, features: features }
    })

    onAction('removeByIndexes', (indexesToRemove) => {
      if (!indexesToRemove.length) console.warn('no indexes to remove')
      const stateCopy: FeatureCollection = { ...state, features: [...state.features] }
      stateCopy.features = state.features.filter((feature, featureIndex) => {
        return !indexesToRemove.includes(featureIndex)
      })
      state = stateCopy
      
      schedule(dispatch => dispatch(create('sendToFocusedGeometry')))
    });


    return state;
  },
  'drawnGeometryAtom',
);
