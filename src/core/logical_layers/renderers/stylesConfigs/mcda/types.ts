export type ColorsByMapLibreExpression = {
  type: 'mapLibreExpression';
  parameters: Record<string, string | number | boolean | maplibregl.Expression>;
};

export type ColorsBySentiments = {
  type: 'sentiments';
  parameters: {
    good: string;
    bad: string;
  };
};

export type OutliersPolicy = 'as_on_limits' | 'exclude';

export interface MCDALayer {
  id: string;
  name: string;
  axis: [string, string];
  range: [number, number];
  sentiment: [string, string];
  outliersPolicy: OutliersPolicy;
  coefficient: number;
  transformationFunction: TransformationFunction;
  normalization: Normalization;
  unit: string | null;
}

export interface MCDAConfig {
  id: string;
  version: 4;
  layers: Array<MCDALayer>;
  colors: ColorsBySentiments | ColorsByMapLibreExpression;
  custom?: boolean;
}

export type Normalization = 'max-min' | 'no';
export type TransformationFunction = 'no' | 'natural_logarithm' | 'square_root';

export interface JsonMCDAv4 {
  id: string;
  version: 4;
  layers: Array<{
    axis: [string, string];
    range: [number, number];
    sentiment: [string, string];
    coefficient: number;
    transformationFunction: TransformationFunction;
    normalization: Normalization;
  }>;
  colors: ColorsBySentiments | ColorsByMapLibreExpression;
}

export interface MCDALayerStyle {
  type: 'mcda';
  config: MCDAConfig;
}
