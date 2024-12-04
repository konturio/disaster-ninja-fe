import type {
  ColorsByMapLibreExpression,
  ColorsBySentiments,
  MCDALayerStyle,
} from '../stylesConfigs/mcda/types';

export type MultivariateAxis = MCDALayerStyle;

export type LabelAxis = {
  formatString?: string;
  propertyName?: string;
  valueExpression?: any;
  axis?: MultivariateAxis;
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
  tileLabel?: LabelAxis;
  extrusionMin?: MultivariateAxis | number;
  extrusionMax?: MultivariateAxis | number;
  colors?: MultivariateColorConfig;
}
