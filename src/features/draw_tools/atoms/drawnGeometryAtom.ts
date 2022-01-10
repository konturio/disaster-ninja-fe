import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { Feature, FeatureCollection } from 'geojson';
import { activeDrawModeAtom } from './activeDrawMode';
import { point as createPointFeature } from '@turf/helpers'
import { FocusedGeometry } from '~core/shared_state/focusedGeometry';

const defaultState: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export const drawnGeometryAtom = createBindAtom(
  {
    addFeature: (feature: Feature) => feature,
    updateFeatures: (features: Feature[]) => features,
    updateByIndex: (feature: Feature, index: number) => {
      return { feature, index };
    },
    removeByIndexes: (indexes: number[]) => indexes,
    focusedGeometryAtom,
    activeDrawModeAtom,
  },
  (
    { schedule, onAction, create, onChange, get, getUnlistedState },
    state: FeatureCollection = defaultState,
  ) => {
    onAction('addFeature', (feature) => {
      state = { ...state, features: [...state.features, feature] };
    });

    onAction('updateFeatures', (features) => {
      state = { ...state, features: features };
    });

    onAction('updateByIndex', ({ feature, index }) => {
      const stateCopy: FeatureCollection = {
        ...state,
        features: [...state.features],
      };
      if (!stateCopy.features[index])
        console.warn(`index ${index} doesn't exist in feature collection`);
      stateCopy.features[index] = feature;
      state = stateCopy;
    });

    onAction('removeByIndexes', (indexesToRemove) => {
      if (!indexesToRemove.length) console.warn('no indexes to remove');
      const stateCopy: FeatureCollection = {
        ...state,
        features: [...state.features],
      };
      stateCopy.features = state.features.filter((feature, featureIndex) => {
        return !indexesToRemove.includes(featureIndex);
      });
      state = stateCopy;
    });

    onChange('focusedGeometryAtom', (incoming) => {
      const mode = get('activeDrawModeAtom');
      if (!mode) return;

      if (incoming?.source.type === 'uploaded')
        schedule((dispatch) => {
          const actions: any[] = [];
          updateFromGeometry(incoming, actions, create)

          // clear focused geometry afterwards
          actions.push(focusedGeometryAtom.setFocusedGeometry(null, null));
          dispatch(actions);
        });
    });

    onChange('activeDrawModeAtom', (mode, prevMode) => {
      const focusedFeatures = getUnlistedState(focusedGeometryAtom);
      if (mode && !prevMode && focusedFeatures) {
        schedule((dispatch) => {
          const actions: any[] = [
            focusedGeometryAtom.setFocusedGeometry(
              { type: 'drawn' },
              { type: 'FeatureCollection', features: [] },
            ),
          ];
          updateFromGeometry(focusedFeatures, actions, create)
          dispatch(actions);
        });
      } else if (!mode && prevMode)
        schedule((dispatch) => {
          dispatch(
            focusedGeometryAtom.setFocusedGeometry({ type: 'drawn' }, state),
          );
          state = defaultState;
        });
    });

    return state;
  },
  'drawnGeometryAtom',
);

function updateFromGeometry(focusedGeometry: FocusedGeometry, actions: any[], create: any) {
  if (focusedGeometry.geometry.type === 'FeatureCollection') {
    const noMultipoints: Feature[] = focusedGeometry.geometry.features.reduce((result: Feature[], currentFeature) => {
      if (currentFeature.geometry.type === 'MultiPoint') {
        currentFeature.geometry.coordinates.forEach(
          coordinate => result.push(createPointFeature(coordinate))
        )
      } else result.push(currentFeature)
      return result
    }, [])

    actions.push(create('updateFeatures', noMultipoints))
  } else if (focusedGeometry.geometry.type === 'Feature') {
    actions.push(
      create('updateFeatures', [focusedGeometry.geometry]),
    )
  } else {
    console.warn('wrong type of data imported or the type is not supported');
  }
}