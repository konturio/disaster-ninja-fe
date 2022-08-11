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

type AxisNominatorInfo = {
  [numerator: string]: {
    mostQualityDenominator: string;
    quality: number;
    layersCount: number;
  };
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

      const axisNominatorInfo = axis.reduce<AxisNominatorInfo>((acc, axis) => {
        if (!axis.quality || axis.quality < 0.5) return acc; // we don't need low quality axises

        const [numerator, denominator] = axis.quotient;
        if (!acc[numerator]) {
          acc[numerator] = {
            mostQualityDenominator: denominator,
            quality: axis.quality,
            layersCount: 1,
          };
        } else {
          acc[numerator].layersCount++;

          const prevAxisQualityByNumerator = acc[numerator].quality;
          if (prevAxisQualityByNumerator < axis.quality) {
            acc[numerator] = {
              ...acc[numerator],
              mostQualityDenominator: denominator,
              quality: axis.quality,
            };
          }
        }
        return acc;
      }, {});

      const getMostQualityDenominatorForNumenator = (
        numenator: string,
      ): string | undefined =>
        axisNominatorInfo?.[numenator]?.mostQualityDenominator;

      const numeratorCorellationMap: NumeratorCorellationMap = {};

      const bivariateColorManagerData =
        correlationRates.reduce<BivariateColorManagerData>(
          (acc, correlationRate) => {
            const [xNumerator, xDenominator] = correlationRate.x.quotient;
            const [yNumerator, yDenominator] = correlationRate.y.quotient;

            // x - for vertical, y - for horizontal
            const xQuotientIndicator = indicatorsMap[xNumerator];
            const yQuotientIndicator = indicatorsMap[yNumerator];

            // fill numeratorCorellationMap with correllation by layer for sorting sublists
            // avgCorrelationY is by Y, so we associate it with yQuotientIndicator
            numeratorCorellationMap[yQuotientIndicator.name] =
              correlationRate.avgCorrelationY;

            const key = JSON.stringify({
              vertical: xQuotientIndicator.direction,
              horizontal: yQuotientIndicator.direction,
            });

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

      fillLayersWithCorrelationLevelAndMaps(
        bivariateColorManagerData,
        numeratorCorellationMap,
        axisNominatorInfo,
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

const fillLayersWithCorrelationLevelAndMaps = (
  bivariateColorManagerData: BivariateColorManagerData,
  numeratorCorellationMap: NumeratorCorellationMap,
  axisNominatorInfo: AxisNominatorInfo,
): void => {
  Object.values(bivariateColorManagerData).forEach((row) => {
    let horizontalLayersSum = 0;
    let verticalLayersSum = 0;

    Object.values(row.horizontal).forEach((layer) => {
      layer.correlationLevel = numeratorCorellationMap[layer.name] || 0;
      horizontalLayersSum += axisNominatorInfo[layer.name].layersCount;
    });
    Object.values(row.vertical).forEach((layer) => {
      layer.correlationLevel = numeratorCorellationMap[layer.name] || 0;
      verticalLayersSum += axisNominatorInfo[layer.name].layersCount;
    });

    row.maps = horizontalLayersSum * verticalLayersSum;
  });
};
