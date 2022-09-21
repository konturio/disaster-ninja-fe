import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import type { AnalyticsData } from '~core/types';

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
      throw new Error(i18n.t('analytics_panel.error_loading'));
    }

    // in case there is no error but response data is empty
    if (responseData === undefined) throw new Error(i18n.t('no_data_received'));

    return responseData;
  },
  'analyticsResource',
  focusedGeometryAtom,
);
