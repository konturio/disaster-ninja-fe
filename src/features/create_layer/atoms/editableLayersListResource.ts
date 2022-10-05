import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createAtom } from '~utils/atoms/createPrimitives';
import { apiClient } from '~core/apiClientInstance';
import { currentApplicationAtom } from '~core/shared_state';
import { EDITABLE_LAYERS_GROUP } from '~core/constants';
import type { EditableLayers } from '../types';

/**
 * This resource atom get editable user layers
 */
const editableLayersListDependencyAtom = createAtom(
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
  'editableLayersListDependencyAtom',
);

export const editableLayersListResource = createAsyncAtom(
  editableLayersListDependencyAtom,
  async (params, abortController) => {
    const body = params?.appId ? { appId: params?.appId } : {};

    const responseData = await apiClient.post<EditableLayers[]>(
      '/layers/search/',
      body,
      true,
      { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
    );
    if (responseData === null) return [];

    /* Performance optimization - editable layers updated in create_layer feature */
    return responseData.filter((l) => l.group === EDITABLE_LAYERS_GROUP);
  },
  'editableLayersListResource',
);
