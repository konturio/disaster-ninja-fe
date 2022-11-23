import { generateColorTheme } from '~utils/bivariate/bivariateColorThemeUtils';
import { isApiError } from '~core/api_client';
import { fillBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { parseGraphQLErrors } from '~utils/graphql/parseGraphQLErrors';
import core from '~core/index';
import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import { createBivariateQuery } from '~utils/bivariate';
import type { Axis, Direction, Indicator } from '~utils/bivariate';
import type { BivariateStatisticsResponse } from '~features/bivariate_manager/types';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { ColorTheme } from '~core/types';

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

type AxisNominatorInfo = {
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
      responseData = await core.api.apiClient.post<{
        data: BivariateStatisticsResponse;
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

    const stats = responseData.data.polygonStatistic.bivariateStatistic;
    const { correlationRates, indicators, axis, colors, meta } = stats;

    if (!correlationRates || !indicators || !axis) {
      const msg = parseGraphQLErrors(responseData);
      throw new Error(msg || core.i18n.t('no_data_received'));
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
          mostQualityAxis: axis,
        };
      } else {
        acc[numerator].layersCount++;

        const prevAxisQualityByNumerator = acc[numerator].quality;
        if (prevAxisQualityByNumerator < axis.quality) {
          acc[numerator] = {
            ...acc[numerator],
            mostQualityDenominator: denominator,
            quality: axis.quality,
            mostQualityAxis: axis,
          };
        }
      }
      return acc;
    }, {});

    const getMostQualityDenominatorForNumenator = (
      numenator: string,
    ): string | undefined => axisNominatorInfo?.[numenator]?.mostQualityDenominator;

    const getMostQualityAxisByNumerator = (numenator: string): Axis =>
      axisNominatorInfo?.[numenator].mostQualityAxis;

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
            getMostQualityDenominatorForNumenator(xNumerator);
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
            getMostQualityDenominatorForNumenator(yNumerator);
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
      axisNominatorInfo,
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
