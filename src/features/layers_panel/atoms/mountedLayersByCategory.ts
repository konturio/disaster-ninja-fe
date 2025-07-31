import { atom } from '@reatom/framework';
import { logicalLayersHierarchyAtom } from '~core/logical_layers/atoms/layersHierarchy';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

export const mountedLayersByCategoryAtom = atom((ctx) => {
  const layersHierarchy = ctx.spy(logicalLayersHierarchyAtom.v3atom);
  const enabledLayers = ctx.spy(enabledLayersAtom.v3atom);
  return Object.values(layersHierarchy).reduce((acc, layer) => {
    if (layer.category && enabledLayers?.has(layer.id)) {
      acc[layer.category] = (acc[layer.category] ?? 0) + 1;
    }
    return acc;
  }, {});
}, 'mountedLayersByCategoryAtom');
