import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';
import { AnalyticsData } from '~core/types';

export const analyticsResourceAtom = createResourceAtom(
  async (fGeo) => {
    if (!fGeo) return null;
    const geometry = fGeo?.geometry as GeoJSON.FeatureCollection;
    if (geometry.features && geometry.features.length == 0) return null;
    let responseData: AnalyticsData[] | null | undefined;
    try {
      responseData = await apiClient.post<AnalyticsData[] | null>(
        `/polygon_details`,
        fGeo?.geometry,
        false,
        { errorsConfig: { dontShowErrors: true } },
      );
    } catch (e: unknown) {
      throw new Error('Error while fetching analytics data');
    }

    // in case there is no error but response data is empty
    if (responseData === undefined) throw new Error('No data received');

    return responseData;
  },
  focusedGeometryAtom,
  'analyticsResource',
);
