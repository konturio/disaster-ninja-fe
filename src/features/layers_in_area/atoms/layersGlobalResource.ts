import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { filterUnsupportedLayerTypes } from '~core/logical_layers/layerTypes';
import { getGlobalLayers } from '~core/api/layers';

export const layersGlobalResource = createAsyncAtom(
  null,
  async (_, abortController) => {
    const layers = await getGlobalLayers(abortController);
    return filterUnsupportedLayerTypes(layers || []);
  },
  'layersGlobalResource',
);
