import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import { isApiError } from '~core/api_client/apiClientError';
import type { AdvancedAnalyticsData } from '~core/types';

const abortControllers: AbortController[] = [];

export const advancedAnalyticsResourceAtom = createResourceAtom(
  (fGeo) => {
    async function processor() {
      if (!fGeo) return null;
      let responseData: AdvancedAnalyticsData[] | null | undefined;
      const abortController = new AbortController();
      abortControllers.push(abortController);
      try {
        responseData = await apiClient.post<AdvancedAnalyticsData[] | null>(
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
          throw new Error('Error while fetching advanced analytics data');
        }
      }

      // in case there is no error but response data is empty
      if (responseData === undefined) throw new Error('No data received');

      return responseData;
    }

    function canceller() {
      try {
        abortControllers.forEach((ab) => ab.abort());
        abortControllers.length = 0;
      } catch (e) {
        console.warn('Cannot abort previous advanced analytics request!', e);
      }
    }

    return { processor, canceller };
  },
  'advancedAnalyticsResource',
  focusedGeometryAtom,
  true,
);
