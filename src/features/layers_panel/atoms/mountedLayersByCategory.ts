import { createAtom } from '~utils/atoms';
import { logicalLayersHierarchyAtom } from '~core/logical_layers/atoms/layersHierarchy';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

export const mountedLayersByCategoryAtom = createAtom(
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
