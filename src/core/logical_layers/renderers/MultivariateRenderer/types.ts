import type { ColorTheme } from '~core/types';
import type { SymbolLayerSpecification } from 'maplibre-gl';
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
  sortExpression?: any;
  paintProperties?: SymbolLayerSpecification['paint'];
  layoutProperties?: SymbolLayerSpecification['layout'];
};

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
  base: MultivariateAxis;
  annex?: MultivariateAxis;
  strength?: MultivariateAxis | number;
  tileLabel?: LabelAxis;
  extrusionMin?: MultivariateAxis | number;
  extrusionMax?: MultivariateAxis | number;
  colors?: MultivariateColorConfig;
}
