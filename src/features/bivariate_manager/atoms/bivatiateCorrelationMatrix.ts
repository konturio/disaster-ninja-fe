import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { CorrelationMatrix } from '~core/types';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { CorrelationRate } from '@k2-packages/bivariate-tools/tslib/types/stat.types';

export const bivariateCorrelationMatrixAtom = createAtom(
  {
    bivariateNumeratorsAtom,
  },
  ({ get, getUnlistedState }, state: CorrelationMatrix | null = null) => {
    const { xGroups, yGroups } = get('bivariateNumeratorsAtom');

    if (xGroups.length && yGroups.length) {
      const { data: statisticsData } = getUnlistedState(
        bivariateStatisticsResourceAtom,
      );
      if (statisticsData === null) return null;
      const correlationRates: CorrelationRate[] =
        statisticsData.polygonStatistic.bivariateStatistic.correlationRates;

      const matrix: CorrelationMatrix = [];
      for (let i = 0; i < yGroups.length; i += 1) {
        matrix.push([]);
        for (let j = 0; j < xGroups.length; j += 1) {
          matrix[i].push(null);
        }
      }

      for (let i = 0; i < yGroups.length; i += 1) {
        const yNumerator = yGroups[i].selectedQuotient[0];
        const yDenominator = yGroups[i].selectedQuotient[1];
        for (let j = 0; j < xGroups.length; j += 1) {
          const xNumerator = xGroups[j].selectedQuotient[0];
          const xDenominator = xGroups[j].selectedQuotient[1];
          for (let k = 0; k < correlationRates.length; k += 1) {
            const cr = correlationRates[k];
            if (
              cr.x.quotient[0] === xNumerator &&
              cr.x.quotient[1] === xDenominator &&
              cr.y.quotient[0] === yNumerator &&
              cr.y.quotient[1] === yDenominator
            ) {
              matrix[i][j] = cr.rate;
              break;
            }
          }
        }
      }

      state = matrix;
    }

    return state;
  },
  'bivariateCorrelationMatrix',
);
