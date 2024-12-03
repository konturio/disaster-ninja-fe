import type { BivariateLegendStep } from '~core/logical_layers/types/legends';
import type {
  ColorsByMapLibreExpression,
  ColorsBySentiments,
  MCDALayerStyle,
} from '../stylesConfigs/mcda/types';
import type { Axis } from '~utils/bivariate';

export type MultivariateAxis =
  | {
      type: 'axis';
      axis: Axis;
    }
  | MCDALayerStyle;

export type LabelAxis = {
  label: string;
};

export type MultivariateColorConfig =
  | {
      type: 'bivariate';
      colors: { id: string; color: string }[];
    }
  | {
      type: 'mcda';
      colors: ColorsBySentiments | ColorsByMapLibreExpression;
    };

export interface MultivariateLayerConfig {
  version: 0;
  id: string;
  name: string;
  base: MultivariateAxis;
  annex?: MultivariateAxis;
  strength?: MultivariateAxis | number;
  label?: LabelAxis;
  extrusionMin?: MultivariateAxis;
  extrusionMax?: MultivariateAxis;
  colors?: MultivariateColorConfig;
}
