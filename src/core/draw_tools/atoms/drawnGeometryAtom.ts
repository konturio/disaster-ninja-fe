import { createAtom } from '~utils/atoms';
import { activeDrawModeAtom } from './activeDrawMode';
import type { Feature, FeatureCollection } from 'geojson';

const defaultState: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export const drawnGeometryAtom = createAtom(
  {
    addFeature: (feature: Feature) => feature,
    setFeatures: (features: Feature[]) => features,
    removeByIndexes: (indexes: number[]) => indexes,
    resetToDefault: () => null,
    activeDrawModeAtom,
  },
  ({ onAction, schedule }, state: FeatureCollection = defaultState) => {
    onAction('addFeature', (feature) => {
      state = { ...state, features: [...state.features, feature] };
    });

    onAction('setFeatures', (features) => {
      state = { ...state, features: features };
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

    onAction('resetToDefault', () => {
      state = defaultState;
    });

    return state;
  },
  'drawnGeometryAtom',
);
