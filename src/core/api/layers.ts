import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';
import type { Feature } from 'geojson';
import type { LayerDetailsDto, LayerSummaryDto } from '~core/logical_layers/types/source';

export const LAYERS_IN_AREA_API_ERROR =
  'Unfortunately, we cannot display map layers. Try refreshing the page or come back later.';

export function getGlobalLayers(abortController: AbortController) {
  return apiClient.post<LayerSummaryDto[]>(
    '/layers/search/global',
    { appId: configRepo.get().id },
    {
      errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR },
      signal: abortController.signal,
    },
  );
}

export type LayersInAreaAndEventLayerResourceParameters = {
  geoJSON: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
};

export function getLayersInArea(
  params: LayersInAreaAndEventLayerResourceParameters,
  abortController: AbortController,
) {
  return apiClient.post<LayerSummaryDto[]>(
    '/layers/search/selected_area',
    {
      appId: configRepo.get().id,
      ...params,
    },
    {
      errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR },
      signal: abortController.signal,
    },
  );
}

export async function getDefaultLayers(appId: string, language: string) {
  const layers = await apiClient.get<LayerDetailsDto[]>(
    `/apps/${appId}/layers`,
    undefined,
    {
      headers: { 'user-language': language },
    },
  );
  // TODO: use layers source configs to cache layer data
  return layers ?? [];
}

export async function getLayersDetails(ids: string[], appId: string, language: string) {
  const layers = await apiClient.post<LayerDetailsDto[]>(
    `/layers/details`,
    {
      layersToRetrieveWithoutGeometryFilter: ids,
      appId: appId,
    },
    {
      headers: { 'user-language': language },
    },
  );
  // TODO: use layers source configs to cache layer data
  return layers ?? [];
}

export function getLayerFeatures(
  layerId: string,
  params: {
    geoJSON?: GeoJSON.GeoJSON;
    limit?: number;
    offset?: number;
    order?: 'asc' | 'desc';
  },
  abortController: AbortController,
) {
  return apiClient.post<Feature[]>(
    `/layers/${layerId}/items/search`,
    {
      appId: configRepo.get().id,
      geoJSON: params.geoJSON,
      limit: params.limit,
      order: params.order,
      offset: params.offset,
    },
    {
      signal: abortController.signal,
    },
  );
}
