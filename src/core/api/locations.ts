import { apiClient } from '~core/apiClientInstance';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import type { Bbox } from '~core/shared_state/currentMapPosition';
import type { Geometry } from 'geojson';

export interface LocationProperties {
  display_name: string;
  osm_id: number;
  bbox: Bbox;
}

export interface LocationsDTO {
  locations: GeoJSON.FeatureCollection<Geometry, LocationProperties>;
}

export function getLocations(query: string) {
  return apiClient.get<LocationsDTO>(
    '/search',
    { appId: configRepo.get().id, query },
    true,
    {
      errorsConfig: { hideErrors: true },
      headers: { 'user-language': i18n.instance.language },
    },
  );
}
