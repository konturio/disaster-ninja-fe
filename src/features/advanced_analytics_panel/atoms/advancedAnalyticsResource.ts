import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';
import { AdvancedAnalyticsData } from '~core/types';

export const advancedAnalyticsResourceAtom = createResourceAtom(
  focusedGeometryAtom,
  async (fGeo) => {
    if (!fGeo) return null;
    const responseData = await apiClient.post<AdvancedAnalyticsData[] | null>(
      `/advanced_polygon_details/`,
      fGeo?.geometry,
      false,
    );
    if (responseData === undefined) throw new Error('No data received');
    return responseData;
  },
  'advancedAnalyticsResource',
);
