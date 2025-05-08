import type { SymbolLayerSpecification } from 'maplibre-gl';
import type { Step } from '~utils/bivariate';
import type { ColorTheme } from '~core/types';
import type {
  ColorsByMapLibreExpression,
  ColorsBySentiments,
  MCDALayerStyle,
} from '../stylesConfigs/mcda/types';

export type MultivariateDimension = MCDALayerStyle;

export type TextDimension = {
  formatString?: string;
  propertyName?: string;
  valueExpression?: any;
  mcda?: MultivariateDimension;
  paintOverrides?: SymbolLayerSpecification['paint'];
  layoutOverrides?: SymbolLayerSpecification['layout'];
};

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
  text?: TextDimension;
  colors?: MultivariateColorConfig;
}
