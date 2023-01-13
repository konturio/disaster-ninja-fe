import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/auth/types';
import type { AnalyticsData } from '~core/types';

export const analyticsResourceAtom = createAsyncAtom(
  focusedGeometryAtom,
  async (fGeo, abortController) => {
    if (!fGeo) return null;
    const geometry = fGeo?.geometry as GeoJSON.FeatureCollection;
    if (geometry.features && geometry.features.length == 0) return null;
    let responseData: AnalyticsData[] | null | undefined;
    try {
      responseData = await apiClient.post<AnalyticsData[] | null>(
        `/polygon_details`,
        fGeo?.geometry,
        false,
        { signal: abortController.signal },
      );
    } catch (e: unknown) {
      dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, false);
      throw new Error(i18n.t('analytics_panel.error_loading'));
    }
    dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, !!responseData);
    // in case there is no error but response data is empty
    if (responseData === undefined) throw new Error(i18n.t('no_data_received'));

    return responseData;
  },
  'analyticsResource',
);
