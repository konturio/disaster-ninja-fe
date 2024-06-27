import { apiClient } from '~core/apiClientInstance';
import { generateColorTheme } from '~utils/bivariate/bivariateColorThemeUtils';
import { isApiError } from '~core/api_client/apiClientError';
import { fillBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import { i18n } from '~core/localization';
import { createBivariateQuery } from '~core/bivariate';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { axisDTOtoAxis } from '~utils/bivariate/helpers/converters/axixDTOtoAxis';
import type { Axis, Direction, Indicator } from '~utils/bivariate';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { ColorTheme } from '~core/types';
import type { BivariateStatisticsResponse } from '~core/resources/bivariateStatisticsResource/types';

export type TableDataValue = {
  label: string;
  name: string;
  correlationLevel?: number;
  mostQualityDenominator?: string;
  axis?: Axis;
};

export type TableData = {
  [key: string]: TableDataValue;
};

export type BivariateColorManagerDataValue = {
  legend?: BivariateLegend;
  meta?: LayerMeta;
  colorTheme: ColorTheme;
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

type AxisNumeratorInfo = {
  [numerator: string]: {
    mostQualityDenominator: string;
    quality: number;
    layersCount: number;
    mostQualityAxis: Axis;
  };
};

export const bivariateColorManagerResourceAtom = createAsyncAtom(
  null,
  async (_, abortController) => {
    let responseData: {
      data: BivariateStatisticsResponse;
      errors?: unknown;
    } | null;

    try {
      const body = createBivariateQuery();
      responseData = await apiClient.post<{
        data: BivariateStatisticsResponse;
      }>('/bivariate_matrix', body, true, {
        signal: abortController.signal,
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

    const stats = responseData.data.polygonStatistic.bivariateStatistic;
    const { correlationRates, indicators, axis, colors, meta } = stats;

    if (!correlationRates || !indicators || !axis) {
      const msg = parseGraphQLErrors(responseData);
      throw new Error(msg || i18n.t('no_data_received'));
    }

    const indicatorsMap = indicators.reduce<IndicatorsMap>((acc, value) => {
      if (value?.name) acc[value.name] = value;
      return acc;
    }, {});

    const axisNumeratorInfo = axis.reduce<AxisNumeratorInfo>((acc, axis) => {
      if (!axis.quality || axis.quality < 0.5) return acc; // we don't need low quality axises

      const [numerator, denominator] = axis.quotient;
      if (!acc[numerator]) {
        acc[numerator] = {
          mostQualityDenominator: denominator,
          quality: axis.quality,
          layersCount: 1,
          mostQualityAxis: axisDTOtoAxis(axis),
        };
      } else {
        acc[numerator].layersCount++;

        const prevAxisQualityByNumerator = acc[numerator].quality;
        if (prevAxisQualityByNumerator < axis.quality) {
          acc[numerator] = {
            ...acc[numerator],
            mostQualityDenominator: denominator,
            quality: axis.quality,
            mostQualityAxis: axisDTOtoAxis(axis),
          };
        }
      }
      return acc;
    }, {});

    const getMostQualityDenominatorForNumerator = (
      numerator: string,
    ): string | undefined => axisNumeratorInfo?.[numerator]?.mostQualityDenominator;

    const getMostQualityAxisByNumerator = (numerator: string): Axis =>
      axisNumeratorInfo?.[numerator].mostQualityAxis;

    const numeratorCorellationMap: NumeratorCorellationMap = {};

    const bivariateColorManagerData = correlationRates.reduce<BivariateColorManagerData>(
      (acc, correlationRate) => {
        const [xNumerator, _xDenominator] = correlationRate.x.quotient;
        const [yNumerator, _yDenominator] = correlationRate.y.quotient;

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
          const colorTheme = generateColorTheme(
            colors,
            xQuotientIndicator.direction,
            yQuotientIndicator.direction,
          );

          if (colorTheme) {
            // this is a common legend for directions combination
            // it has 2 random layers inside that fits directions combination
            const legend = fillBivariateLegend(
              'Bivariate Layer',
              getMostQualityAxisByNumerator(xNumerator),
              getMostQualityAxisByNumerator(yNumerator),
              colorTheme,
            );

            acc[key] = {
              legend,
              colorTheme,
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
            getMostQualityDenominatorForNumerator(xNumerator);
          const xAxis = getMostQualityAxisByNumerator(xNumerator);
          acc[key].vertical[xQuotientIndicator.name] = {
            label: xQuotientIndicator.label,
            name: xQuotientIndicator.name,
            mostQualityDenominator,
            axis: xAxis,
          };
        }

        if (!acc[key].horizontal[yQuotientIndicator.name]) {
          const mostQualityDenominator =
            getMostQualityDenominatorForNumerator(yNumerator);
          const yAxis = getMostQualityAxisByNumerator(yNumerator);
          acc[key].horizontal[yQuotientIndicator.name] = {
            label: yQuotientIndicator.label,
            name: yQuotientIndicator.name,
            mostQualityDenominator,
            axis: yAxis,
          };
        }

        return acc;
      },
      {},
    );

    fillLayersWithCorrelationLevelAndMaps(
      bivariateColorManagerData,
      numeratorCorellationMap,
      axisNumeratorInfo,
    );

    const sortedIndicators = indicators
      .filter((item) => item.name !== 'one') // as 'one' doesn't participate in layers intersections (correlationRates)
      .sort((a, b) => (a.label > b.label ? 1 : -1));

    return {
      bivariateColorManagerData,
      indicators: sortedIndicators,
      meta,
      axis,
    };
  },
  'bivariateColorManagerResource',
);

const fillLayersWithCorrelationLevelAndMaps = (
  bivariateColorManagerData: BivariateColorManagerData,
  numeratorCorellationMap: NumeratorCorellationMap,
  axisNumeratorInfo: AxisNumeratorInfo,
): void => {
  Object.values(bivariateColorManagerData).forEach((row) => {
    let horizontalLayersSum = 0;
    let verticalLayersSum = 0;

    Object.values(row.horizontal).forEach((layer) => {
      layer.correlationLevel = numeratorCorellationMap[layer.name] || 0;
      horizontalLayersSum += axisNumeratorInfo[layer.name].layersCount;
    });
    Object.values(row.vertical).forEach((layer) => {
      layer.correlationLevel = numeratorCorellationMap[layer.name] || 0;
      verticalLayersSum += axisNumeratorInfo[layer.name].layersCount;
    });

    row.maps = horizontalLayersSum * verticalLayersSum;
  });
};
