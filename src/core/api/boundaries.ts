import { apiClient } from '~core/apiClientInstance';
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
    },
  );
}
