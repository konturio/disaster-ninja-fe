import type { TransformationFunction } from '../types';

export interface JsonMCDAv1 {
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

export type JsonMCDA = JsonMCDAv1 | JsonMCDAv2;
