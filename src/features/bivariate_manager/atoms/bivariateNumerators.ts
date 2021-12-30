import { createBindAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { extractAvailableNumeratorsWithDenominators, Stat } from '@k2-packages/bivariate-tools';
import {
  BivariateLayerStyle,
  generateColorThemeAndBivariateStyle,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme, NumeratorWithDenominators } from '~core/types';
import { logicalLayersRegistryAtom } from '~core/shared_state';
import {
  LogicalLayerAtom,
  createLogicalLayerAtom,
} from '~core/logical_layers/createLogicalLayerAtom';
import { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';

export const bivariateNumeratorsAtom = createBindAtom(
  {
    setNumerators: (numxX: NumeratorWithDenominators[], numsY: NumeratorWithDenominators[]) => ({ xNumerators: numxX, yNumerators: numsY }),
    bivariateStatisticsResourceAtom,
  },
  ({ get, onAction, onChange }, state: {xNumerators:  NumeratorWithDenominators[], yNumerators:  NumeratorWithDenominators[] } = { xNumerators: [], yNumerators: [] }) => {
    onChange('bivariateStatisticsResourceAtom', ({ data: statisticsData, loading }) => {
      if (statisticsData && !loading) {
        const stats: Stat = statisticsData.polygonStatistic.bivariateStatistic;

        // get all available numerators with denominators
        const numerators = extractAvailableNumeratorsWithDenominators(stats);

        // add first denominator as selected
        const numsX: NumeratorWithDenominators[] = numerators.x.map((num) => ({
          ...num,
          selectedDenominator: num.denominators[0],
        }));
        const numsY: NumeratorWithDenominators[] = numerators.y.map((num) => ({
          ...num,
          selectedDenominator: num.denominators[0],
        }));

        state = { xNumerators: numsY, yNumerators: numsY };
      }
    });

    onAction('setNumerators', ( nums) => {
      state = nums;
    });

    return state;
  },
  'bivariateNumerators',
);
