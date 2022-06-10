import type { Stat } from '~utils/bivariate';

export type BivariateStatisticsResponse = {
  polygonStatistic: {
    bivariateStatistic: Stat;
  };
};
