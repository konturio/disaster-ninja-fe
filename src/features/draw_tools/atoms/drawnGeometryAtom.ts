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
    focusedGeometryAtom
  },
  ({ schedule, onAction, create, onChange }, state: FeatureCollection = defaultState) => {

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

    onChange('focusedGeometryAtom', incoming => {
      if (incoming?.source.type === 'uploaded') schedule(dispatch => {
        if (incoming.geometry.type === 'FeatureCollection' && incoming.geometry.features?.length) {
          const actions: any[] = []
          incoming.geometry.features.forEach((feature) => actions.push(create('addFeature', feature)));
          actions.length && dispatch(actions);
        } else if (incoming.geometry.type === 'Feature') {
          dispatch(create('addFeature', incoming.geometry))
        }
        else console.warn('wrong type of data imported')
      })
    })


    return state;
  },
  'drawnGeometryAtom',
);
