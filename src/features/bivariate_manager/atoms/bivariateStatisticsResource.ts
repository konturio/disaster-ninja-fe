import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import { isApiError } from '~core/api_client';
import core from '~core/index';
import { createBivariateQuery, isGeometryEmpty } from '~utils/bivariate';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';

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
      responseData = await core.api.apiClient.post<{
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
      throw new Error(core.i18n.t('no_data_received'));
    }
    if (!responseData?.data) {
      const msg = parseGraphQLErrors(responseData);
      throw new Error(msg || core.i18n.t('no_data_received'));
    }

    if (isGeometryEmpty(geom) && !allMapStats) {
      allMapStats = responseData.data;
    }

    return responseData.data;
  },
  'bivariateStatisticsResource',
);
