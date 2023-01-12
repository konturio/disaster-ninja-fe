import { createAtom } from '@reatom/core';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import { createBivariateQuery, isGeometryEmpty } from '~core/bivariate';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import { isApiError } from '~core/api_client/apiClientError';
import { i18n } from '~core/localization';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';
import type { FocusedGeometry } from '~core/shared_state/focusedGeometry';

const bivariateStatisticsDependencyAtom = createAtom(
  { focusedGeometryAtom },
  (
    { onChange },
    state: {
      focusedGeometry: FocusedGeometry | null;
    } = {
      focusedGeometry: null,
    },
  ) => {
    onChange('focusedGeometryAtom', (focusedGeometry) => {
      state = { focusedGeometry };
    });

    return state;
  },
  'bivariateStatisticsDependencyAtom',
);

let allMapStats: BivariateStatisticsResponse;

export const bivariateStatisticsResourceAtom = createAsyncAtom(
  bivariateStatisticsDependencyAtom,
  async ({ focusedGeometry }, abortController) => {
    if (!focusedGeometry?.geometry && allMapStats) {
      return allMapStats;
    }
    let responseData: {
      data: BivariateStatisticsResponse;
      errors?: unknown;
    } | null;
    try {
      const body = createBivariateQuery(focusedGeometry);
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

    if (isGeometryEmpty(focusedGeometry) && !allMapStats) {
      allMapStats = responseData.data;
    }

    return responseData.data;
  },
  'bivariateStatisticsResource',
);
