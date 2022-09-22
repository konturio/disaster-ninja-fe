import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import { createBivariateQuery, isGeometryEmpty } from '~core/bivariate';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import { isApiError } from '~core/api_client/apiClientError';
import { i18n } from '~core/localization';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';

let allMapStats: BivariateStatisticsResponse;
const abortControllers: AbortController[] = [];

export const bivariateStatisticsResourceAtom = createResourceAtom(
  (geom) => {
    async function processor() {
      if (!geom && allMapStats) {
        return allMapStats;
      }

      let responseData: {
        data: BivariateStatisticsResponse;
        errors?: unknown;
      } | null;
      const abortController = new AbortController();
      abortControllers.push(abortController);
      try {
        const body = createBivariateQuery(geom);
        responseData = await apiClient.post<{
          data: BivariateStatisticsResponse;
          errors?: unknown;
        }>('/bivariate_matrix', body, true, {
          signal: abortController.signal,
          errorsConfig: { dontShowErrors: true },
        });
      } catch (e) {
        if (isApiError(e) && e.problem.kind === 'canceled') {
          return null;
        }
        throw e;
      }

      if (!responseData) {
        throw new Error(i18n.t('no_data_received'));
      }
      if (!responseData?.data) {
        const msg = parseGraphQLErrors(responseData);
        throw new Error(msg || i18n.t('no_data_received'));
      }

      if (isGeometryEmpty(geom) && !allMapStats) {
        allMapStats = responseData.data;
      }

      return responseData.data;
    }

    function canceller() {
      try {
        abortControllers.forEach((ab) => ab.abort());
        abortControllers.length = 0;
      } catch (e) {
        console.warn('Cannot abort previous bivariate request!', e);
      }
    }

    return { processor, canceller };
  },
  'bivariateStatisticsResource',
  focusedGeometryAtom,
  true,
);
