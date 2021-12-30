import { createBindAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { extractAvailableNumeratorsWithDenominators, Stat } from '@k2-packages/bivariate-tools';
import {
  BivariateLayerStyle,
  generateColorThemeAndBivariateStyle,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme, CorrelationMatrix, NumeratorWithDenominators } from '~core/types';
import { logicalLayersRegistryAtom } from '~core/shared_state';
import {
  LogicalLayerAtom,
  createLogicalLayerAtom,
} from '~core/logical_layers/createLogicalLayerAtom';
import { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { CorrelationRate } from '@k2-packages/bivariate-tools/tslib/types/stat.types';

export const bivariateCorrelationMatrixAtom = createBindAtom(
  {
    bivariateNumeratorsAtom,
  },
  ({ get, getUnlistedState }, state: CorrelationMatrix | null = null) => {
    const { xNumerators, yNumerators } = get(
      'bivariateNumeratorsAtom',
    );

    if (xNumerators.length && yNumerators.length) {
      const { data: statisticsData } = getUnlistedState(bivariateStatisticsResourceAtom);
      const correlationRates: CorrelationRate[] = statisticsData.polygonStatistic.bivariateStatistic.correlationRates;

      const matrix: CorrelationMatrix = [];
      for (let i = 0; i < yNumerators.length; i += 1) {
        matrix.push([]);
        for (let j = 0; j < xNumerators.length; j += 1) {
          matrix[i].push(null);
        }
      }

      for (let i = 0; i < yNumerators.length; i += 1) {
        const yNumerator = yNumerators[i].numeratorId;
        const yDenominator = yNumerators[i].selectedDenominator;
        for (let j = 0; j < xNumerators.length; j += 1) {
          const xNumerator = xNumerators[j].numeratorId;
          const xDenominator = xNumerators[j].selectedDenominator;
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
