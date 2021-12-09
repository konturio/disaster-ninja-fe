import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryStateAtom } from '~core/logical_layers/atoms/logicalLayersRegistryState';
import { logicalLayersHierarchyAtom } from '~core/logical_layers/atoms/logicalLayersHierarchy';

export const mountedLayersByCategoryAtom = createBindAtom(
  {
    layersHierarchy: logicalLayersHierarchyAtom,
    layersStates: logicalLayersRegistryStateAtom,
  },
  ({ get }, state: Record<string, number> = {}) => {
    const layersHierarchy = get('layersHierarchy');
    const layersStates = get('layersStates');
    return Object.values(layersHierarchy).reduce((acc, layer) => {
      if (layer.category && layersStates[layer.id]) {
        if (layersStates[layer.id].isMounted) {
          acc[layer.category] = (acc[layer.category] ?? 0) + 1;
        }
      }
      return acc;
    }, {});
  },
  'mountedLayersByCategoryAtom',
);
