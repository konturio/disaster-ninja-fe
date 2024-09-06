import { apiClient } from '~core/apiClientInstance';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';

export interface LocationsDTO {
  locations: GeoJSON.FeatureCollection;
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
