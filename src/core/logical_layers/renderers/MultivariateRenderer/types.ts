import type { Step } from '~utils/bivariate';
import type { ColorTheme } from '~core/types';
import type {
  ColorsByMapLibreExpression,
  ColorsBySentiments,
  MCDALayerStyle,
} from '../stylesConfigs/mcda/types';

export type MultivariateDimension = MCDALayerStyle;

export type BivariateColorConfig = {
  type: 'bivariate';
  colors: ColorTheme;
};

export type MCDAColorConfig = {
  type: 'mcda';
  colors: ColorsBySentiments | ColorsByMapLibreExpression;
};

export type MultivariateColorConfig = BivariateColorConfig | MCDAColorConfig;
export type MultivariateStepOverrides = {
  baseSteps?: Step[];
  scoreSteps?: Step[];
};

export interface MultivariateLayerConfig {
  version: 0;
  id: string;
  name: string;
  score: MultivariateDimension;
  base?: MultivariateDimension;
  stepOverrides?: MultivariateStepOverrides;
  opacity?: MultivariateDimension | number;
  colors?: MultivariateColorConfig;
}
