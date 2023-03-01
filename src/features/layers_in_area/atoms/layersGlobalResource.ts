import { appConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { LAYERS_IN_AREA_API_ERROR } from '../constants';
import type { LayerSummaryDto } from '~core/logical_layers/types/source';

export const layersGlobalResource = createAsyncAtom(
  null,
  async (_, abortController) => {
    const layers = await apiClient.post<LayerSummaryDto[]>(
      '/layers/search/global',
      { appId: appConfig.id },
      true,
      {
        errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR },
        signal: abortController.signal,
      },
    );
    return layers;
  },
  'layersGlobalResource',
);
