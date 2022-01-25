import { createBindAtom } from '~utils/atoms';
import { logicalLayersHierarchyAtom } from '~core/logical_layers/atoms/logicalLayersHierarchy';
import { enabledLayersAtom } from '~core/shared_state/enabledLayers';

export const mountedLayersByCategoryAtom = createBindAtom(
  {
    layersHierarchy: logicalLayersHierarchyAtom,
    enabledLayers: enabledLayersAtom,
  },
  ({ get }, state: Record<string, number> = {}) => {
    const layersHierarchy = get('layersHierarchy');
    const enabledLayers = get('enabledLayers');
    return Object.values(layersHierarchy).reduce((acc, layer) => {
      if (layer.category && enabledLayers?.has(layer.id)) {
        acc[layer.category] = (acc[layer.category] ?? 0) + 1;
      }
      return acc;
    }, {});
  },
  'mountedLayersByCategoryAtom',
);
