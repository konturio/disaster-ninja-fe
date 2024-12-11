import { atom } from '@reatom/framework';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { createBivariateQuery } from '~core/bivariate';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import { isApiError } from '~core/api_client/apiClientError';
import { i18n } from '~core/localization';
import { axisDTOtoAxis } from '~utils/bivariate/helpers/converters/axisDTOtoAxis';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import type { Stat } from '~utils/bivariate';
import type { BivariateStatisticsResponse } from './types';

const bivariateStatisticsDependencyAtom = v3toV2(
  atom((ctx) => {
    const focusedGeometry = ctx.spy(focusedGeometryAtom.v3atom);
    return { focusedGeometry };
  }),
);

let worldStatsCache: Stat;

export const bivariateStatisticsResourceAtom = createAsyncAtom(
  bivariateStatisticsDependencyAtom,
  async ({ focusedGeometry }, abortController) => {
    if (!focusedGeometry?.geometry && worldStatsCache) {
      return worldStatsCache;
    }
    try {
      const body = createBivariateQuery(focusedGeometry?.geometry);
      const responseData = await apiClient.post<{
        data: BivariateStatisticsResponse;
        errors?: unknown;
      }>('/bivariate_matrix', body, true, {
        signal: abortController.signal,
        retryAfterTimeoutError: {
          times: 2,
          delayMs: 1000,
        },
      });

      if (!responseData) {
        throw new Error(i18n.t('no_data_received'));
      }

      const { data } = responseData;
      if (!data) {
        const msg = parseGraphQLErrors(responseData);
        throw new Error(msg || i18n.t('no_data_received'));
      }

      const statsDTO = data.polygonStatistic.bivariateStatistic;

      // Check for correlationRates
      if (!statsDTO || !Array.isArray(statsDTO?.correlationRates)) {
        throw new Error(i18n.t('wrong_data_received'));
      }

      // Adapt Axes
      const stat: Stat = {
        ...statsDTO,
        axis: statsDTO.axis.map((ax) => axisDTOtoAxis(ax)),
      };

      if (isGeoJSONEmpty(focusedGeometry?.geometry) && !worldStatsCache) {
        worldStatsCache = stat;
      }

      return stat;
    } catch (e) {
      if (isApiError(e) && e.problem.kind === 'canceled') {
        return null;
      }
      throw e;
    }
  },
  'bivariateStatisticsResource',
);
