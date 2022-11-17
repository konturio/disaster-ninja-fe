import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { createBivariateQuery, isGeometryEmpty } from '~core/bivariate';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import { isApiError } from '~core/api_client';
import { i18n } from '~core/localization';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';
import { apiClient } from '~core/apiClientInstance';

let allMapStats: BivariateStatisticsResponse;

export const bivariateStatisticsResourceAtom = createAsyncAtom(
  focusedGeometryAtom,
  async (geom, abortController) => {
    if (!geom && allMapStats) {
      return allMapStats;
    }
    let responseData: {
      data: BivariateStatisticsResponse;
      errors?: unknown;
    } | null;
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
  },
  'bivariateStatisticsResource',
);
