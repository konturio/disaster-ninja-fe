import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/apiClientInstance';
import { generateColorThemeAndBivariateStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { isApiError } from '~core/api_client/apiClientError';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import { createBivariateColorsGraphQLQuery } from '../utils/createBivariateColorsGraphQLQuery';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';
import type { Direction, Indicator } from '~utils/bivariate';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { LayerMeta } from '~core/logical_layers/types/meta';

export type TableDataValue = {
  label: string;
  name: string;
  correlationLevel?: number;
  mostQualityDenominator?: string;
};

export type TableData = {
  [key: string]: TableDataValue;
};

export type BivariateColorManagerDataValue = {
  legend?: BivariateLegend;
  meta?: LayerMeta;
  vertical: TableData;
  horizontal: TableData;
  maps: number;
  directions: {
    vertical: Direction;
    horizontal: Direction;
  };
};

export type BivariateColorManagerData = {
  [key: string]: BivariateColorManagerDataValue;
};

type IndicatorsMap = { [key: string]: Indicator };
export type NumeratorCorellationMap = { [key: string]: number | undefined };

type AxisNominatorQualityMap = {
  [numerator: string]: [denominator: string, quality: number];
};

const abortControllers: AbortController[] = [];

const fillLayersWithCorrelationLevel = (
  bivariateColorManagerData: BivariateColorManagerData,
  numeratorCorellationMap: NumeratorCorellationMap,
): void => {
  Object.values(bivariateColorManagerData).forEach((row) => {
    [...Object.values(row.horizontal), ...Object.values(row.vertical)].forEach(
      (layer) => {
        layer.correlationLevel = numeratorCorellationMap[layer.name] || 0;
      },
    );
  });
};

export const bivariateColorManagerResourceAtom = createResourceAtom(
  () => {
    async function processor() {
      let responseData: {
        data: BivariateStatisticsResponse;
        errors?: unknown;
      } | null;

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

      const stats = responseData.data.polygonStatistic.bivariateStatistic;
      const { correlationRates, indicators, axis } = stats;

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

      const numeratorCorellationMap: NumeratorCorellationMap = {};

      const bivariateColorManagerData =
        correlationRates.reduce<BivariateColorManagerData>(
          (acc, correlationRate) => {
            const xQuotientNumerator = correlationRate.x.quotient[0];
            const yQuotientNumerator = correlationRate.y.quotient[0];

            // x - for vertical, y - for horizontal
            const xQuotientIndicator = indicatorsMap[xQuotientNumerator];
            const yQuotientIndicator = indicatorsMap[yQuotientNumerator];

            // fill numeratorCorellationMap with correllation by layer for sorting sublists
            // avgCorrelationY is by Y, so we associate it with yQuotientIndicator
            numeratorCorellationMap[yQuotientIndicator.name] =
              correlationRate.avgCorrelationY;

            const key = JSON.stringify({
              vertical: xQuotientIndicator.direction,
              horizontal: yQuotientIndicator.direction,
            });

            const xNumerator = correlationRate.x.quotient[0];
            const xDenominator = correlationRate.x.quotient[1];
            const yNumerator = correlationRate.y.quotient[0];
            const yDenominator = correlationRate.y.quotient[1];

            if (!acc[key]) {
              const colorThemeAndBivariateStyle =
                generateColorThemeAndBivariateStyle(
                  xNumerator,
                  xDenominator,
                  yNumerator,
                  yDenominator,
                  stats,
                );

              if (colorThemeAndBivariateStyle) {
                const [colorTheme] = colorThemeAndBivariateStyle;
                const legend = createBivariateLegend(
                  'Bivariate Layer',
                  colorTheme,
                  xNumerator,
                  xDenominator,
                  yNumerator,
                  yDenominator,
                  stats,
                );

                acc[key] = {
                  legend,
                  vertical: {},
                  horizontal: {},
                  maps: 0,
                  directions: {
                    vertical: xQuotientIndicator.direction,
                    horizontal: yQuotientIndicator.direction,
                  },
                };
              }
            }

            acc[key].maps++;

            if (!acc[key].vertical[xQuotientIndicator.name]) {
              const mostQualityDenominator =
                getMostQualityDenominatorForNumenator(xQuotientIndicator.name);
              acc[key].vertical[xQuotientIndicator.name] = {
                label: xQuotientIndicator.label,
                name: xQuotientIndicator.name,
                mostQualityDenominator,
              };
            }

            if (!acc[key].horizontal[yQuotientIndicator.name]) {
              const mostQualityDenominator =
                getMostQualityDenominatorForNumenator(yQuotientIndicator.name);
              acc[key].horizontal[yQuotientIndicator.name] = {
                label: yQuotientIndicator.label,
                name: yQuotientIndicator.name,
                mostQualityDenominator,
              };
            }

            return acc;
          },
          {},
        );

      fillLayersWithCorrelationLevel(
        bivariateColorManagerData,
        numeratorCorellationMap,
      );

      const sortedIndicators = indicators
        .filter((item) => item.name !== 'one') // as 'one' doesn't participate in layers intersections (correlationRates)
        .sort((a, b) => (a.label > b.label ? 1 : -1));

      return {
        bivariateColorManagerData,
        indicators: sortedIndicators,
      };
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
  'bivariateColorManagerResource',
  null,
  true,
);
