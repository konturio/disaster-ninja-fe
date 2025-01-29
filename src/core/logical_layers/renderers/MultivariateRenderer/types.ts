import type { Step } from '~utils/bivariate';
import type { ColorTheme } from '~core/types';
import type {
  ColorsByMapLibreExpression,
  ColorsBySentiments,
  MCDALayerStyle,
} from '../stylesConfigs/mcda/types';

export type MultivariateAxis = MCDALayerStyle;

export type MultivariateColorConfig =
  | {
      type: 'bivariate';
      colors: ColorTheme;
    }
  | {
      type: 'mcda';
      colors: ColorsBySentiments | ColorsByMapLibreExpression;
    };

export interface MultivariateLayerConfig {
  version: 0;
  id: string;
  name: string;
  score: MultivariateAxis;
  base?: MultivariateAxis;
  stepOverrides?: {
    baseSteps?: Step[];
    scoreSteps?: Step[];
  };
  strength?: MultivariateAxis | number;
  colors?: MultivariateColorConfig;
}
