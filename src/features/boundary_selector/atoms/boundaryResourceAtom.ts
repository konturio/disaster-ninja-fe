import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { GeoJSONPoint } from '~utils/geoJSON/helpers';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';

export const boundaryResourceAtom = createAsyncAtom(
  clickCoordinatesAtom,
  async (params, abortController) => {
    if (!params) return null;
    const { lng, lat } = params;
    const responseData = await apiClient.post<GeoJSON.FeatureCollection | null>(
      '/boundaries',
      new GeoJSONPoint([lng, lat]),
      false,
      { signal: abortController.signal },
    );
    if (!responseData) throw 'No data received';
    return responseData;
  },
  'boundaryResourceAtom',
);
