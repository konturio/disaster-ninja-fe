import type { TransformationFunction, Normalization } from '../types';

export interface JsonMCDAv1 {
  version?: 1;
  id?: string;
  layers: Array<{
    axis: [string, string];
    range: [number, number];
    sentiment: [string, string];
    coefficient: number;
  }>;
  colors: {
    good: string;
    bad: string;
  };
}

export interface JsonMCDAv2 {
  id?: string;
  version: 2;
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

export interface JsonMCDAv3 {
  id?: string;
  version: 3;
  layers: Array<{
    axis: [string, string];
    range: [number, number];
    sentiment: [string, string];
    coefficient: number;
    transformationFunction: TransformationFunction;
    normalization: Normalization;
  }>;
  colors: {
    good: string;
    bad: string;
  };
}

export type JsonMCDA = JsonMCDAv1 | JsonMCDAv2 | JsonMCDAv3;
