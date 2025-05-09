import { useAtom } from '@reatom/npm-react';
import { layersMetaAtom } from '~core/logical_layers/atoms/layersMeta';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

export const useLayersCopyrights = () => {
  const [enabled] = useAtom(enabledLayersAtom.v3atom);
  const [meta] = useAtom(layersMetaAtom.v3atom);
  const result: string[] = [];

  for (const layerId of enabled) {
    const state = meta.get(layerId);
    const copyrights = state?.data?.copyrights;
    if (Array.isArray(copyrights)) {
      result.push(...copyrights);
    }
  }

  const uniqueItems = [...new Set(result)];
  return uniqueItems.join(' ');
};
