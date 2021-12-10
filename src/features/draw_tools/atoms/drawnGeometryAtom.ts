import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { FeatureCollection, Feature } from 'geojson';
import { activeDrawModeAtom } from './activeDrawMode'


const defaultState: FeatureCollection = {
  type: 'FeatureCollection', features: []
}

export const drawnGeometryAtom = createBindAtom(
  {
    addFeature: (feature: Feature) => feature,
    updateFeatures: (features: Feature[]) => features,
    removeByIndexes: (indexes: number[]) => indexes,
    focusedGeometryAtom,
    activeDrawModeAtom
  },
  ({ schedule, onAction, create, onChange }, state: FeatureCollection = defaultState) => {

    onAction('addFeature', (feature) => {
      state = { ...state, features: [...state.features, feature] }
    });


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
    });

    onChange('focusedGeometryAtom', incoming => {
      if (activeDrawModeAtom.getState() === undefined) return;

      if (incoming?.source.type === 'uploaded') schedule(dispatch => {
        const actions: any[] = []
        if (incoming.geometry.type === 'FeatureCollection' && incoming.geometry.features?.length) {
          incoming.geometry.features.forEach((feature) => actions.push(create('addFeature', feature)));
        } else if (incoming.geometry.type === 'Feature') {
          actions.push(create('addFeature', incoming.geometry))
        }
        else console.warn('wrong type of data imported')

        // clear focused geometry afterwards
        actions.push(focusedGeometryAtom.setFocusedGeometry({ type: 'custom' }, { type: 'FeatureCollection', features: [] }))
        dispatch(actions);
      })
    })

    onChange('activeDrawModeAtom', mode => {
      if (mode) return;
      if (state.features.length) schedule((dispatch) => {
        dispatch(
          focusedGeometryAtom.setFocusedGeometry(
            { type: 'custom' },
            state
          )
        )
        state = defaultState
      }
      );
    })


    return state;
  },
  'drawnGeometryAtom',
);
