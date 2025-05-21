import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { filterUnsupportedLayerTypes } from '~core/logical_layers/layerTypes';
import { getGlobalLayers } from '~core/api/layers';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';

export const layersGlobalResource = createAsyncAtom(
  null,
  async (_, abortController) => {
    const layers = await getGlobalLayers(abortController);
    const filteredLayers = filterUnsupportedLayerTypes(layers || []);
    dispatchMetricsEventOnce('layersGlobalResource', filteredLayers.length > 0);
    return filteredLayers;
  },
  'layersGlobalResource',
);
