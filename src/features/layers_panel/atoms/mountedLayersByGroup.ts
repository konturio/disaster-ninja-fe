import { atom } from '@reatom/framework';
import { logicalLayersHierarchyAtom } from '~core/logical_layers/atoms/layersHierarchy';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

export const mountedLayersByGroupAtom = atom((ctx) => {
  const layersHierarchy = ctx.spy(logicalLayersHierarchyAtom.v3atom);
  const enabledLayers = ctx.spy(enabledLayersAtom.v3atom);
  return Object.values(layersHierarchy).reduce(
    (acc, layer) => {
      if (layer.group && enabledLayers?.has(layer.id)) {
        acc[layer.group] = (acc[layer.group] ?? 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
}, 'mountedLayersByGroupAtom');
