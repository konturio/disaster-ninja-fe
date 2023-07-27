import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { i18n } from '~core/localization';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/auth/types';
import { getPolygonDetails } from '~core/api/insights';
import type { AnalyticsData } from '~core/types';

export const analyticsResourceAtom = createAsyncAtom(
  focusedGeometryAtom,
  async (fGeo, abortController) => {
    if (!fGeo) return null;
    const geometry = fGeo?.geometry as GeoJSON.FeatureCollection;
    if (!geometry?.features?.length) return null;
    let responseData: AnalyticsData[] | null | undefined;
    try {
      responseData = await getPolygonDetails(geometry, abortController);
    } catch (e: unknown) {
      dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, false);
      throw new Error(i18n.t('analytics_panel.error_loading'));
    }
    dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, !!responseData);
    // in case there is no error but response data is empty
    if (!responseData?.length) {
      throw new Error(i18n.t('advanced_analytics_empty.no_analytics'));
    }
    return responseData;
  },
  'analyticsResource',
);
