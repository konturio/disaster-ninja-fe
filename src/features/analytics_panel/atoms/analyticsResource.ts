import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';
import { AnalyticsData } from '~appModule/types';

export const analyticsResourceAtom = createResourceAtom(
  focusedGeometryAtom,
  async (fGeo) => {
    if (!fGeo) return null
    const responseData = await apiClient.post<AnalyticsData[] | null>(
      `/analytics/`,
      fGeo?.geometry,
      false,
    );
    if (responseData === undefined) throw new Error('No data received');
    return responseData;
  },
  'analyticsResource',
);
