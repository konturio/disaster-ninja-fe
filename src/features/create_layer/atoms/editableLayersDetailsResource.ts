import { createAtom } from '~utils/atoms/createPrimitives';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { editableLayersListResource } from './editableLayersListResource';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter: string[];
  layersToRetrieveWithoutGeometryFilter: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
}

/* This atom subscribes to all data that required for request layer details  */
export const editableLayersDetailsParamsAtom = createAtom(
  {
    enabledLayersAtom,
    editableLayersResourceAtom: editableLayersListResource,
  },
  ({ get }, state: DetailsRequestParams | null = null): DetailsRequestParams | null => {
    const editableLayersResource = get('editableLayersResourceAtom');
    if (editableLayersResource.loading || editableLayersResource.data === null)
      return state;
    const editableLayers = editableLayersResource.data;
    if (editableLayers === undefined) return null;

    const allEnabledLayers = get('enabledLayersAtom');
    const enabledEditableLAyers = editableLayers.filter((l) =>
      allEnabledLayers.has(l.id),
    );

    if (enabledEditableLAyers.length === 0) {
      return null;
    }

    const requestParams: DetailsRequestParams = {
      layersToRetrieveWithoutGeometryFilter: enabledEditableLAyers.map((l) => l.id),
      layersToRetrieveWithGeometryFilter: [],
    };

    return requestParams;
  },
  'editableLayersDetailsParamsAtom',
);

// Call api
export const editableLayersDetailsResourceAtom = createAsyncAtom(
  editableLayersDetailsParamsAtom,
  async (params, abortController) => {
    if (params === null) return null;
    return await apiClient.post<LayerDetailsDto[]>(
      '/layers/details',
      { ...params, appId: configRepo.get().id },
      {
        headers: { 'user-language': configRepo.get().initialUser.language },
        signal: abortController.signal,
        authRequirement: apiClient.AUTH_REQUIREMENT.MUST,
      },
    );
  },
  'editableLayersDetailsResourceAtom',
);
