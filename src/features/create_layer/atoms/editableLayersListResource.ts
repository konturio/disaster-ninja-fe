import { createResourceAtom } from '~utils/atoms/createResourceAtom';
import { createAtom } from '~utils/atoms/createPrimitives';
import { apiClient } from '~core/index';
import { EditableLayers } from '../types';
import { currentApplicationAtom } from '~core/shared_state';
import { EDITABLE_LAYERS_GROUP } from '~core/constants';

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

export const editableLayersListResource = createResourceAtom(
  async (params) => {
    const body = params?.appId ? { appId: params?.appId } : {};

    const responseData = await apiClient.post<EditableLayers[]>(
      '/layers/search/',
      body,
      true,
    );
    if (responseData === undefined) throw new Error('No data received');

    /* Performance optimization - editable layers updated in create_layer feature */
    return responseData.filter((l) => l.group === EDITABLE_LAYERS_GROUP);
  },
  editableLayersListDependencyAtom,
  'editableLayersListResource',
);
