export type Normalization = 'max-min' | 'no';
export type TransformationFunction = 'no' | 'natural_logarithm' | 'square_root';

export type ColorsByMapLibreExpression = {
  type: 'mapLibreExpression';
  parameters: Record<string, string | number | mapboxgl.Expression>;
};

export type ColorsBySentiments = {
  type: 'sentiments';
  parameters: {
    good: string;
    bad: string;
  };
};

export interface MCDAConfig {
  id: string;
  version: number;
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

export type PopupMCDAProps = {
  layers: MCDAConfig['layers'];
  normalized: {
    [key: string]: { norm: number; val: number };
  };
  resultMCDA: number;
};
