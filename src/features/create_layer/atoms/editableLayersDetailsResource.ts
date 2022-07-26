import { createAtom } from '~utils/atoms/createPrimitives';
import { createResourceAtom } from '~utils/atoms/createResourceAtom';
import { apiClient } from '~core/apiClientInstance';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { editableLayersListResource } from './editableLayersListResource';
import type { LayerInAreaDetails } from '../types';

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
  (
    { get },
    state: DetailsRequestParams | null = null,
  ): DetailsRequestParams | null => {
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
      layersToRetrieveWithoutGeometryFilter: enabledEditableLAyers.map(
        (l) => l.id,
      ),
      layersToRetrieveWithGeometryFilter: [],
    };

    return requestParams;
  },
);

// Call api
export const editableLayersDetailsResourceAtom = createResourceAtom(
  async (params) => {
    if (params === null) return null;
    return await apiClient.post<LayerInAreaDetails[]>(
      '/layers/details',
      params,
      true,
    );
  },
  'editableLayersDetailsResourceAtom',
  editableLayersDetailsParamsAtom,
);
