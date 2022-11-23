import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import { EDITABLE_LAYERS_GROUP } from '~core/constants';
import core from '~core/index';
import type { EditableLayers } from '../types';

export const editableLayersListResource = createAsyncAtom(
  null,
  async () => {
    const responseData = await core.api.apiClient.post<EditableLayers[]>(
      '/layers/search/',
      { appId: core.app.id },
      true,
    );
    if (responseData === null) return [];

    /* Performance optimization - editable layers updated in create_layer feature */
    return responseData.filter((l) => l.group === EDITABLE_LAYERS_GROUP);
  },
  'editableLayersListResource',
);
