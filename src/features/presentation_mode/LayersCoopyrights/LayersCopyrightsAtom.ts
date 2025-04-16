import { atom } from '@reatom/framework';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { layersMetaAtom } from '~core/logical_layers/atoms/layersMeta';

export const layersCopyrightsAtom = atom((ctx) => {
  const enabled = ctx.spy(enabledLayersAtom.v3atom);
  const meta = ctx.spy(layersMetaAtom.v3atom);

  const result: string[] = [];

  for (const layerId of enabled) {
    const state = meta.get(layerId);
    const copyrights = state?.data?.copyrights;
    if (Array.isArray(copyrights)) {
      result.push(...copyrights);
    }
  }

  return result.join(' ');
}, 'layersCopyrightsAtom');
