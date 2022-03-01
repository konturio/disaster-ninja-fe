import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/shared_state';
import { Feature, FeatureCollection } from 'geojson';
import { activeDrawModeAtom } from './activeDrawMode';
import { point as createPointFeature } from '@turf/helpers';
import {
  FocusedGeometry,
  FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
} from '~core/shared_state/focusedGeometry';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';

const defaultState: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export const drawnGeometryAtom = createAtom(
  {
    addFeature: (feature: Feature) => feature,
    setFeatures: (features: Feature[]) => features,
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

    onAction('setFeatures', (features) => {
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

    /**
     * While draw mode is active, some geometry can be uploaded which will be received by focusedGeometryAtom
     * this listener intercepts geometry in such case
     */

    onChange('focusedGeometryAtom', (incoming) => {
      const mode = get('activeDrawModeAtom');
      if (!mode) return;

      if (incoming?.source.type === 'uploaded')
        schedule((dispatch) => {
          const actions: any[] = [];
          updateFromGeometry(incoming, actions, create);
          dispatch(actions);
        });
    });

    onChange('activeDrawModeAtom', (activeMode, previousActiveMode) => {
      const focusedFeatures = getUnlistedState(focusedGeometryAtom);
      if (activeMode && !previousActiveMode && focusedFeatures) {
        schedule((dispatch) => {
          const actions: any[] = [
            enabledLayersAtom.delete(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID),
          ];
          updateFromGeometry(focusedFeatures, actions, create);
          dispatch(actions);
        });
      } else if (!activeMode && previousActiveMode) {
        // if draw mode was turned off after being turned on
        schedule((dispatch) => {
          dispatch([
            focusedGeometryAtom.setFocusedGeometry({ type: 'drawn' }, state),
            enabledLayersAtom.set(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID),
          ]);
          state = defaultState;
        });
      }
    });

    return state;
  },
  'drawnGeometryAtom',
);

// here I use deepCopy to modify feature.properties object later
function updateFromGeometry(
  focusedGeometry: FocusedGeometry,
  actions: any[],
  create: any,
) {
  if (focusedGeometry.geometry.type === 'FeatureCollection') {
    const noMultipoints: Feature[] = focusedGeometry.geometry.features.reduce(
      (result: Feature[], currentFeature) => {
        if (currentFeature.geometry.type === 'MultiPoint') {
          currentFeature.geometry.coordinates.forEach((coordinate) =>
            result.push(createPointFeature(coordinate)),
          );
        } else result.push(deepCopy(currentFeature));
        return result;
      },
      [],
    );

    actions.push(create('setFeatures', noMultipoints));
  } else if (focusedGeometry.geometry.type === 'Feature') {
    actions.push(create('setFeatures', [deepCopy(focusedGeometry.geometry)]));
  } else {
    console.warn('wrong type of data imported or the type is not supported');
  }
}
