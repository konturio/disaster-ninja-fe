import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import { isApiError } from '~core/api_client/apiClientError';
import { i18n } from '~core/localization';
import type { AdvancedAnalyticsData } from '~core/types';

const abortControllers: AbortController[] = [];

export const advancedAnalyticsResourceAtom = createAsyncAtom(
  focusedGeometryAtom,
  async (fGeo, abortController) => {
    if (!fGeo) return null;
    let responseData: AdvancedAnalyticsData[] | null | undefined;
    abortControllers.push(abortController);
    try {
      responseData = await apiClient.post<AdvancedAnalyticsData[] | null>(
        `/advanced_polygon_details/`,
        fGeo?.geometry,
        true,
        {
          signal: abortController.signal,
        },
      );
    } catch (e) {
      if (isApiError(e) && e.problem.kind === 'canceled') {
        return null;
      } else {
        throw new Error(i18n.t('advanced_analytics_panel.error'));
      }
    }

    // in case there is no error but response data is empty
    if (responseData === undefined) throw new Error(i18n.t('no_data_received'));

    return responseData;
  },
  'advancedAnalyticsResource',
);
