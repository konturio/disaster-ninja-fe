import { apiClient } from '~core/apiClientInstance';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import type { Geometry } from 'geojson';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Bbox } from '~core/shared_state/currentMapPosition';

export interface LocationProperties {
  display_name: string;
  osm_id: number;
  bbox: Bbox;
}

export interface LocationsDTO {
  locations: GeoJSON.FeatureCollection<Geometry, LocationProperties>;
}

export function getLocations(query: string, abortController?: AbortController) {
  return apiClient.get<LocationsDTO>(
    '/search',
    { appId: configRepo.get().id, query },
    {
      signal: abortController ? abortController.signal : undefined,
      errorsConfig: { hideErrors: true },
      headers: { 'user-language': i18n.instance.language },
    },
  );
}

export interface MCDASearchDTO {
  config: MCDAConfig;
  type: 'mcda';
}

export function getMCDA(query: string, abortController?: AbortController) {
  return apiClient.get<MCDASearchDTO>(
    '/search/mcda_suggestion',
    { appId: configRepo.get().id, query },
    {
      signal: abortController ? abortController.signal : undefined,
      errorsConfig: { hideErrors: true },
      headers: { 'user-language': i18n.instance.language },
    },
  );
}
