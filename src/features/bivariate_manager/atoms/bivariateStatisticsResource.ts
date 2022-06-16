import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/apiClientInstance';
import { focusedGeometryAtom } from '~core/shared_state';
import {
  createBivariateGraphQLQuery,
  isGeometryEmpty,
} from '~features/bivariate_manager/utils/createBivariateGraphQLQuery';
import { parseGraphQLErrors } from '~features/bivariate_manager/utils/parseGraphQLErrors';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';

let allMapStats: BivariateStatisticsResponse;
const abortControllers: AbortController[] = [];

export const bivariateStatisticsResourceAtom = createResourceAtom(
  (geom) => {
    async function processor() {
      if (!geom && allMapStats) {
        return allMapStats;
      }

      let responseData: { data: BivariateStatisticsResponse } | undefined;
      const abortController = new AbortController();
      abortControllers.push(abortController);
      try {
        responseData = await graphQlClient.post<{
          data: BivariateStatisticsResponse;
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
        if (e.problem && e.problem.kind === 'canceled') {
          return null;
        } else {
          throw e;
        }
      }

      if (!responseData) {
        throw new Error('No data received');
      } else if (!responseData.data) {
        const msg = parseGraphQLErrors(responseData as any);
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

    return [processor, canceller];
  },
  focusedGeometryAtom,
  'bivariateStatisticsResource',
  true,
);
