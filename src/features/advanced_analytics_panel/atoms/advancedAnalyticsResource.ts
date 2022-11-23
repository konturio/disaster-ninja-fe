import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import { isApiError } from '~core/api_client';
import core from '~core/index';
import type { AdvancedAnalyticsData } from '~core/types';

const abortControllers: AbortController[] = [];

export const advancedAnalyticsResourceAtom = createAsyncAtom(
  core.sharedState.focusedGeometryAtom,
  async (fGeo, abortController) => {
    if (!fGeo) return null;
    let responseData: AdvancedAnalyticsData[] | null | undefined;
    abortControllers.push(abortController);
    try {
      responseData = await core.api.apiClient.post<AdvancedAnalyticsData[] | null>(
        `/advanced_polygon_details/`,
        fGeo?.geometry,
        true,
        {
          signal: abortController.signal,
          errorsConfig: { dontShowErrors: true },
        },
      );
    } catch (e) {
      if (isApiError(e) && e.problem.kind === 'canceled') {
        return null;
      } else {
        throw new Error(core.i18n.t('advanced_analytics_panel.error'));
      }
    }

    // in case there is no error but response data is empty
    if (responseData === undefined) throw new Error(core.i18n.t('no_data_received'));

    return responseData;
  },
  'advancedAnalyticsResource',
);
