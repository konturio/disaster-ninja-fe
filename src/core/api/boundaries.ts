import { apiClient } from '~core/apiClientInstance';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { GeoJSONPoint } from '~utils/geoJSON/helpers';

export function getBoundaries(
  coords: [number, number],
  abortController?: AbortController,
) {
  return apiClient.post<GeoJSON.FeatureCollection>(
    '/boundaries',
    new GeoJSONPoint(coords),
    {
      signal: abortController ? abortController.signal : undefined,
      authRequirement: AUTH_REQUIREMENT.OPTIONAL,
    },
  );
}
