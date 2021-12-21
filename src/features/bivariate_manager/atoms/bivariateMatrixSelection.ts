import { createBindAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { extractAvailableNumeratorsWithDenominators, Stat } from '@k2-packages/bivariate-tools';
import {
  BivariateLayerStyle,
  generateColorThemeAndBivariateStyle,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme, NumeratorWithDenominators } from '~appModule/types';
import { logicalLayersRegistryAtom } from '~core/shared_state';
import {
  LogicalLayerAtom,
  createLogicalLayerAtom,
} from '~core/logical_layers/createLogicalLayerAtom';
import { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';

export const bivariateMatrixSelectionAtom = createBindAtom(
  {
    setMatrixSelection: (xNumerator: string | null, yNumerator: string | null) => ({ xNumerator, yNumerator }),
  },
  ({ onAction }, state: { xNumerator: string | null, yNumerator: string | null } = { xNumerator: null, yNumerator: null }) => {
    onAction('setMatrixSelection', ( selection) => {
      state = selection;
    });

    return state;
  },
  'bivariateMatrixSelection',
);
