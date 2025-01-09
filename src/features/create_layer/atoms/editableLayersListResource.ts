import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';
import { EDITABLE_LAYERS_GROUP } from '~core/constants';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import type { EditableLayers } from '../types';

export const editableLayersListResource = createAsyncAtom(
  null,
  async (_, abortController) => {
    const responseData = await apiClient.post<EditableLayers[]>(
      '/layers/search/user',
      { appId: configRepo.get().id },
      {
        signal: abortController.signal,
        authRequirement: AUTH_REQUIREMENT.MUST,
      },
    );
    if (responseData === null) return [];

    /* Performance optimization - editable layers updated in create_layer feature */
    return responseData.filter((l) => l.group === EDITABLE_LAYERS_GROUP);
  },
  'editableLayersListResource',
);
