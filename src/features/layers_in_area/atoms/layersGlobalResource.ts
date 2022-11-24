import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { LAYERS_IN_AREA_API_ERROR } from '../constants';
import type { LayerInArea } from '../types';
import { createAtom } from "~utils/atoms";
import { currentApplicationAtom } from "~core/shared_state";

const layersGlobalResourceParametersAtom = createAtom(
  {
    currentApplicationAtom,
  },
  (
    { onChange },
    state: {
      appId: string | null;
    } = {
      appId: null,
    },
  ) => {
    onChange('currentApplicationAtom', (currentApplication) => {
      state = { appId: currentApplication };
    });

    return state;
  },
  'layersGlobalResourceParametersAtom',
);

export const layersGlobalResource = createAsyncAtom(
  layersGlobalResourceParametersAtom,
  async (params, abortController) => {
    if (!params?.appId) return null;

    const layers = await apiClient.post<LayerInArea[]>(
      '/layers/search/global',
      { appId: params.appId },
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
