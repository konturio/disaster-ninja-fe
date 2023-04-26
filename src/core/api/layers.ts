import { appConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import type { LayerSummaryDto } from '~core/logical_layers/types/source';

export const LAYERS_IN_AREA_API_ERROR =
  'Unfortunately, we cannot display map layers. Try refreshing the page or come back later.';

export function getGlobalLayers(abortController: AbortController) {
  return apiClient.post<LayerSummaryDto[]>(
    '/layers/search/global',
    { appId: appConfig.id },
    true,
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
      appId: appConfig.id,
      ...params,
    },
    true,
    {
      errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR },
      signal: abortController.signal,
    },
  );
}
