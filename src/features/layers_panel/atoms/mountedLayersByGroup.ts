import { createAtom } from '~utils/atoms';
import { logicalLayersHierarchyAtom } from '~core/logical_layers/atoms/layersHierarchy';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

export const mountedLayersByGroupAtom = createAtom(
  {
    layersHierarchy: logicalLayersHierarchyAtom,
    enabledLayers: enabledLayersAtom,
  },
  ({ get }, state: Record<string, number> = {}) => {
    const layersHierarchy = get('layersHierarchy');
    const enabledLayers = get('enabledLayers');
    return Object.values(layersHierarchy).reduce(
      (acc, layer) => {
        if (layer.group && enabledLayers?.has(layer.id)) {
          acc[layer.group] = (acc[layer.group] ?? 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  },
  'mountedLayersByGroupAtom',
);
