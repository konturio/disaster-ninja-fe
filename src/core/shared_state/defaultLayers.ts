import { createAtom } from '~utils/atoms';
import { currentApplicationAtom } from '~core/shared_state/currentApplication';
import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';

type DefaultLayers = string[];

export const defaultLayersParamsAtom = createAtom(
  {
    request: () => null,
    currentApplicationAtom,
  },
  ({ get, onAction }, state: { appId: string | null } | null = null) => {
    onAction('request', () => {
      state = {
        appId: get('currentApplicationAtom'),
      };
    });
    return state;
  },
);

export const defaultAppLayersAtom = createAsyncAtom(
  defaultLayersParamsAtom,
  async (params, abortController) => {
    if (!params) return null;
    const { appId } = params;
    const responseData = await apiClient.get<DefaultLayers | null>(
      `/layers/defaults/`,
      { appId },
      false,
      { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
    );
    if (responseData === undefined) throw new Error('No default layers received');
    return responseData;
  },
  'defaultAppLayersAtom',
);
