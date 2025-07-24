import type { ExpressionSpecification, SymbolLayerSpecification } from 'maplibre-gl';
import type { Step } from '~utils/bivariate';
import type { ColorTheme } from '~core/types';
import type {
  ColorsByMapLibreExpression,
  ColorsBySentiments,
  MCDALayerStyle,
} from '../stylesConfigs/mcda/types';

export type MultivariateDimension = MCDALayerStyle;

// TODO: make static opacity a separate property.
export type OpacityDimension = MultivariateDimension | number;

export type TextDimension = {
  expressionValue?: ExpressionSpecification;
  mcdaValue?: MultivariateDimension;
  mcdaMode?: 'score' | 'layers';
  formatString?: string;
  precision?: number;
  paintOverrides?: SymbolLayerSpecification['paint'];
  layoutOverrides?: SymbolLayerSpecification['layout'];
};

export type ExtrusionDimension = {
  height: MultivariateDimension;
  maxHeight: number;
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
  score?: MultivariateDimension;
  base?: MultivariateDimension;
  stepOverrides?: MultivariateStepOverrides;
  opacity?: OpacityDimension;
  text?: TextDimension;
  extrusion?: ExtrusionDimension;
  colors?: MultivariateColorConfig;
}
