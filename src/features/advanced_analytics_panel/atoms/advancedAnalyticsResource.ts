import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { isApiError } from '~core/api_client/apiClientError';
import { i18n } from '~core/localization';
import { getAdvancedPolygonDetails } from '~core/api/insights';
import type { AdvancedAnalyticsData } from '~core/types';

const abortControllers: AbortController[] = [];

export const advancedAnalyticsResourceAtom = createAsyncAtom(
  focusedGeometryAtom,
  async (fGeo, abortController) => {
    if (!fGeo) return null;
    let responseData: AdvancedAnalyticsData[] | null | undefined;
    abortControllers.push(abortController);
    try {
      responseData = await getAdvancedPolygonDetails(fGeo?.geometry, abortController);
    } catch (e) {
      if (isApiError(e) && e.problem.kind === 'canceled') {
        return null;
      } else {
        throw new Error(i18n.t('advanced_analytics_panel.error'));
      }
    }
    // in case there is no error but response data is empty
    if (!responseData?.length) {
      throw new Error(i18n.t('advanced_analytics_empty.no_analytics'));
    }
    return responseData;
  },
  'advancedAnalyticsResource',
);
