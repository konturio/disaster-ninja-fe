import type { MultivariateLayerConfig } from '../../MultivariateRenderer/types';
import type {
  AxisDatasetStats,
  AxisTransformation,
  Direction,
  Indicator,
} from '~utils/bivariate/types/stat.types';

export type ColorsByMapLibreExpression = {
  type: 'mapLibreExpression';
  parameters: maplibregl.Expression;
};

export type ColorsBySentiments = {
  type: 'sentiments';
  parameters: {
    good: string;
    bad: string;
    /* TODO: using midpoints for gradient customization is a temporary solution.
    It will probably be removed in the future in favor of working with Color Manager */
    midpoints?: { value: number; color: string }[];
  };
};

export type OutliersPolicy = 'clamp' | 'hide' | 'unmodified';

export interface MCDALayer {
  id: string;
  name: string;
  // axis field should either be removed or renamed in future version of MCDA config
  axis: [string, string];
  indicators: Indicator[];
  range: [number, number];
  sentiment: [string, string];
  outliers: OutliersPolicy;
  coefficient: number;
  // TODO: once all presets are updated, remove transformationFunction and make transformation property required
  transformationFunction: TransformationFunction;
  transformation?: AxisTransformation;
  normalization: Normalization;
  unit: string | null;
  datasetStats?: AxisDatasetStats;
}

export interface MCDAConfig {
  id: string;
  name: string;
  version: 4;
  layers: Array<MCDALayer>;
  colors: ColorsBySentiments | ColorsByMapLibreExpression;
}

export type Normalization = 'max-min' | 'no';
export type TransformationFunction =
  | 'no'
  | 'square_root'
  | 'cube_root'
  | 'log'
  | 'log_epsilon';

export interface MCDALayerStyle {
  type: 'mcda';
  config: MCDAConfig;
}

export interface MultivariateLayerStyle {
  type: 'multivariate';
  config: MultivariateLayerConfig;
}
