import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { LAYERS_IN_AREA_API_ERROR } from '../constants';
import type { LayerInArea } from '../types';

export const layersGlobalResource = createAsyncAtom(
  null,
  async (_, abortController) => {
    const layers = await apiClient.post<LayerInArea[]>(
      '/layers/search/global',
      undefined,
      true,
      {
        errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR, dontShowErrors: true },
        signal: abortController.signal,
      },
    );
    return layers;
  },
  'layersGlobalResource',
);
