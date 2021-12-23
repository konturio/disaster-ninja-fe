import { createBindAtom } from '~utils/atoms/createBindAtom';
import { FeatureCollection, Feature } from 'geojson';
import { activeDrawModeAtom } from './activeDrawMode'


const defaultState: FeatureCollection = {
  type: 'FeatureCollection', features: []
}

export const temporaryGeometryAtom = createBindAtom(
  {
    updateFeatures: (features: Feature[], updateIndexes: number[]) => { return { features, indexes: updateIndexes } },
    activeDrawModeAtom,
    resetToDefault: () => null
  },
  ({ onAction, onChange }, state: FeatureCollection = defaultState) => {

    onAction('updateFeatures', ({ features, indexes }) => {
      const tempFeatures: Feature[] = features.map((feature, index) => {
        if (!indexes.includes(index)) return feature
        const copy = { ...feature }
        copy.properties ? (copy.properties.temporary = true) : (copy.properties = { temporary: true })
        return copy
      })
      state = { ...state, features: tempFeatures }
    })

    onAction('resetToDefault', () => (state = defaultState))

    onChange('activeDrawModeAtom', mode => {
      if (mode) return;
      state = defaultState
    })

    return state;
  },
  'temporaryGeometryAtom',
);
