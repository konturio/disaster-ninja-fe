import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { appConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { EDITABLE_LAYERS_GROUP } from '~core/constants';
import type { EditableLayers } from '../types';

export const editableLayersListResource = createAsyncAtom(
  null,
  async (_, abortController) => {
    const responseData = await apiClient.post<EditableLayers[]>(
      '/layers/search/user',
      { appId: appConfig.id },
      true,
      { signal: abortController.signal },
    );
    if (responseData === null) return [];

    /* Performance optimization - editable layers updated in create_layer feature */
    return responseData.filter((l) => l.group === EDITABLE_LAYERS_GROUP);
  },
  'editableLayersListResource',
);
