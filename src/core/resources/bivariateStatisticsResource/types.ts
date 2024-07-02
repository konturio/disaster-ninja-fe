import type {
  Axis,
  Meta,
  InitAxis,
  CorrelationRate,
  Indicator,
  ColorCombination,
} from '~utils/bivariate';

export type AxisDTO = Omit<Axis, 'id' | 'label'> & { label: string | null };

export type StatDTO = {
  axis: AxisDTO[];
  meta: Meta;
  initAxis: InitAxis;
  correlationRates: CorrelationRate[];
  indicators: Indicator[];
  colors: {
    fallback: string;
    combinations: ColorCombination[];
  };
};

export type BivariateStatisticsResponse = {
  polygonStatistic: {
    bivariateStatistic: StatDTO;
  };
};
