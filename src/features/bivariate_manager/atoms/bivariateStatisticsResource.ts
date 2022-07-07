import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import {
  createBivariateGraphQLQuery,
  isGeometryEmpty,
} from '~features/bivariate_manager/utils/createBivariateGraphQLQuery';
import { parseGraphQLErrors } from '~features/bivariate_manager/utils/parseGraphQLErrors';
import { isApiError } from '~core/api_client/apiClientError';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';

let allMapStats: BivariateStatisticsResponse;
const abortControllers: AbortController[] = [];

export const bivariateStatisticsResourceAtom = createResourceAtom(
  (geom) => {
    async function processor() {
      if (!geom && allMapStats) {
        return allMapStats;
      }

      let responseData:
        | { data: BivariateStatisticsResponse; errors?: unknown }
        | undefined;
      const abortController = new AbortController();
      abortControllers.push(abortController);
      try {
        responseData = await graphQlClient.post<{
          data: BivariateStatisticsResponse;
          errors?: unknown;
        }>(
          `/`,
          {
            query: createBivariateGraphQLQuery(geom),
          },
          true,
          {
            signal: abortController.signal,
            errorsConfig: { dontShowErrors: true },
          },
        );
      } catch (e) {
        if (abortController.signal.aborted) {
          return null;
        }
        throw e;
      }

      if (!responseData) {
        throw new Error('No data received');
      }
      if (!responseData?.data) {
        const msg = parseGraphQLErrors(responseData);
        throw new Error(msg || 'No data received');
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
  focusedGeometryAtom,
  'bivariateStatisticsResource',
  true,
);
