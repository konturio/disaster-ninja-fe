import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';
import { AdvancedAnalyticsData } from '~core/types';

export const advancedAnalyticsResourceAtom = createResourceAtom(
  async (fGeo) => {
    if (!fGeo) return null;
    let responseData: AdvancedAnalyticsData[] | null | undefined;
    try {
      responseData = await apiClient.post<AdvancedAnalyticsData[] | null>(
        `/advanced_polygon_details/`,
        fGeo?.geometry,
        false,
        { errorsConfig: { dontShowErrors: true } },
      );
    } catch (e: unknown) {
      throw new Error('Error while fetching advanced analytics data');
    }

    // in case there is no error but response data is empty
    if (responseData === undefined) throw new Error('No data received');

    return responseData;
  },
  focusedGeometryAtom,
  'advancedAnalyticsResource',
);
