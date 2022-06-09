import { createAtom } from '~utils/atoms';
import { activeDrawModeAtom } from './activeDrawMode';
import type { Feature, FeatureCollection } from 'geojson';

const defaultState: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export const temporaryGeometryAtom = createAtom(
  {
    setFeatures: (features: Feature[], updateIndexes: number[]) => {
      return { features, indexes: updateIndexes };
    },
    activeDrawModeAtom,
    resetToDefault: () => null,
  },
  ({ onAction, onChange }, state: FeatureCollection = defaultState) => {
    onAction('setFeatures', ({ features, indexes }) => {
      const tempFeatures: Feature[] = features.map((feature, index) => {
        if (!indexes.includes(index)) return feature;
        const copy = { ...feature };
        copy.properties
          ? (copy.properties.temporary = true)
          : (copy.properties = { temporary: true });
        return copy;
      });
      state = { ...state, features: tempFeatures };
    });

    onAction('resetToDefault', () => (state = defaultState));

    onChange('activeDrawModeAtom', (mode) => {
      if (mode) return;
      state = defaultState;
    });

    return state;
  },
  'temporaryGeometryAtom',
);
