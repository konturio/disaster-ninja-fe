export interface MCDAConfig {
  id: string;
  version: number;
  layers: Array<{
    axis: [string, string];
    range: [number, number];
    sentiment: [string, string];
    coefficient: number;
    transformationFunction: TransformationFunction;
  }>;
  colors: {
    good: string;
    bad: string;
  };
}

export type TransformationFunction = 'no' | 'natural_logarithm' | 'square_root';

export type PopupMCDAProps = {
  json: MCDAConfig;
  normalized: {
    [key: string]: { norm: number; val: number };
  };
  resultMCDA: number;
};
