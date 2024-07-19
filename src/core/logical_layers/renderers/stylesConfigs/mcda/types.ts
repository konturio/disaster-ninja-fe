import type { Indicator } from '~utils/bivariate/types/stat.types';

export type ColorsByMapLibreExpression = {
  type: 'mapLibreExpression';
  parameters: Record<string, string | number | boolean | maplibregl.Expression>;
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

export type OutliersPolicy = 'as_on_limits' | 'exclude';

type MCDAIndicator = Omit<Indicator, 'direction'>;

export interface MCDALayer {
  id: string;
  name: string;
  // axis field should either be removed or renamed in future version of MCDA config
  axis: [string, string];
  indicators: MCDAIndicator[];
  range: [number, number];
  sentiment: [string, string];
  outliers: OutliersPolicy;
  coefficient: number;
  transformationFunction: TransformationFunction;
  normalization: Normalization;
  unit: string | null;
}

export interface MCDAConfig {
  id: string;
  name: string;
  version: 4;
  layers: Array<MCDALayer>;
  colors: ColorsBySentiments | ColorsByMapLibreExpression;
  custom?: boolean;
}

export type Normalization = 'max-min' | 'no';
export type TransformationFunction =
  | 'no'
  | 'natural_logarithm'
  | 'square_root'
  | 'cube_root';

export interface MCDALayerStyle {
  type: 'mcda';
  config: MCDAConfig;
}
