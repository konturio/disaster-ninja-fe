import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { i18n } from '~core/localization';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/auth/types';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { getLlmAnalysis } from '~core/api/insights';
import type { LLMAnalyticsData } from '~core/types';

// TODO: rewrite to reatom v3
export const llmAnalyticsResourceAtom = createAsyncAtom(
  focusedGeometryAtom,
  async (fGeo, abortController) => {
    if (!fGeo) return null;
    const geometry = fGeo?.geometry as GeoJSON.FeatureCollection;
    if (isGeoJSONEmpty(geometry)) {
      return null;
    }
    let responseData: LLMAnalyticsData | null | undefined;
    try {
      responseData = await getLlmAnalysis(geometry, abortController);
    } catch (e: unknown) {
      dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, false);
      throw new Error(i18n.t('analytics_panel.error_loading'));
    }
    dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, !!responseData);
    // in case there is no error but response data is empty
    if (!responseData?.data) {
      throw new Error(i18n.t('advanced_analytics_empty.no_analytics'));
    }
    return responseData;
  },
  'analyticsResource',
);
