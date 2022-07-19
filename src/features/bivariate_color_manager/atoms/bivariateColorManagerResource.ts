import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/apiClientInstance';
import { createBivariateColorsGraphQLQuery } from '~features/bivariate_manager/utils/createBivariateGraphQLQuery';
import { parseGraphQLErrors } from '~features/bivariate_manager/utils/parseGraphQLErrors';
import { generateColorThemeAndBivariateStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { isApiError } from '~core/api_client/apiClientError';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';
import type { Indicator } from '~utils/bivariate';
import type { ColorTheme } from '~core/types';

type TableData = {
  [key: string]: {
    label: string;
    name: string;
    quality?: number;
    mostQualityDenominator?: string;
  };
};

export type BivariateColorManagerData = {
  [key: string]: {
    legend?: ColorTheme;
    vertical: TableData;
    horizontal: TableData;
    maps: number;
  };
};

type IndicatorsMap = { [key: string]: Indicator };

type AxisNominatorQualityMap = {
  [numerator: string]: [denominator: string, quality: number];
};

const abortControllers: AbortController[] = [];

export const bivariateColorManagerResourceAtom = createResourceAtom(
  () => {
    async function processor() {
      let responseData:
        | { data: BivariateStatisticsResponse; errors?: unknown }
        | undefined;

      const abortController = new AbortController();
      abortControllers.push(abortController);

      try {
        responseData = await graphQlClient.post<{
          data: BivariateStatisticsResponse;
        }>(
          `/`,
          {
            query: createBivariateColorsGraphQLQuery(),
          },
          true,
          {
            signal: abortController.signal,
            errorsConfig: { dontShowErrors: true },
          },
        );
      } catch (e) {
        if (isApiError(e) && e.problem.kind === 'canceled') {
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

      const bivariateStatistic =
        responseData.data.polygonStatistic.bivariateStatistic;
      const { correlationRates, indicators, axis } = bivariateStatistic;

      if (!correlationRates || !indicators || !axis) {
        const msg = parseGraphQLErrors(responseData);
        throw new Error(msg || 'No part of data received');
      }

      const indicatorsMap = indicators.reduce<IndicatorsMap>((acc, value) => {
        if (value?.name) acc[value.name] = value;
        return acc;
      }, {});

      const axisNominatorQualityMap = axis.reduce<AxisNominatorQualityMap>(
        (acc, axis) => {
          if (!axis.quality) return acc;

          const [numerator, denominator] = axis.quotient;
          if (!acc[numerator]) {
            acc[numerator] = [denominator, axis.quality];
          } else {
            const prevAxisQualityByNumerator = acc[numerator][1];
            if (prevAxisQualityByNumerator < axis.quality) {
              acc[numerator] = [denominator, axis.quality];
            }
          }
          return acc;
        },
        {},
      );

      const getMostQualityDenominatorForNumenator = (
        numenator: string,
      ): string | undefined => axisNominatorQualityMap?.[numenator]?.[0];

      const bivariateColorManagerData =
        correlationRates.reduce<BivariateColorManagerData>(
          (acc, correlationRate) => {
            const quality = correlationRate.avgCorrelationY;
            const xQuotientNumerator = correlationRate.x.quotient[0];
            const yQuotientNumerator = correlationRate.y.quotient[0];

            const xQuotientIndicator = indicatorsMap[xQuotientNumerator];
            const yQuotientIndicator = indicatorsMap[yQuotientNumerator];

            const key = JSON.stringify({
              vertical: xQuotientIndicator.direction,
              horizontal: yQuotientIndicator.direction,
            });

            if (!acc[key]) {
              const colorThemeAndBivariateStyle =
                generateColorThemeAndBivariateStyle(
                  correlationRate.x.quotient[0],
                  correlationRate.x.quotient[1],
                  correlationRate.y.quotient[0],
                  correlationRate.y.quotient[1],
                  bivariateStatistic,
                );

              const colorTheme = colorThemeAndBivariateStyle?.[0];

              acc[key] = {
                legend: colorTheme,
                vertical: {},
                horizontal: {},
                maps: 0,
              };
            }

            acc[key].maps++;

            if (!acc[key].vertical[xQuotientIndicator.name]) {
              const mostQualityDenominator =
                getMostQualityDenominatorForNumenator(xQuotientIndicator.name);
              acc[key].vertical[xQuotientIndicator.name] = {
                label: xQuotientIndicator.label,
                name: xQuotientIndicator.name,
                quality,
                mostQualityDenominator,
              };
            }

            if (!acc[key].horizontal[yQuotientIndicator.name]) {
              const mostQualityDenominator =
                getMostQualityDenominatorForNumenator(yQuotientIndicator.name);
              acc[key].horizontal[yQuotientIndicator.name] = {
                label: yQuotientIndicator.label,
                name: yQuotientIndicator.name,
                quality,
                mostQualityDenominator,
              };
            }

            return acc;
          },
          {},
        );

      return bivariateColorManagerData;
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
  null,
  'bivariateColorManagerResource',
  true,
);
