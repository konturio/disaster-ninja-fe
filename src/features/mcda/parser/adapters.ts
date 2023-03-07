import type { MCDAConfig } from '../types';
import type { JsonMCDAv1, JsonMCDAv2, JsonMCDAv3 } from './types';

export function firstVersionAdapter(json: JsonMCDAv1): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 1,
    colors: json.colors,
    layers: json.layers.map((l) => ({
      ...l,
      transformationFunction: 'no',
      normalization: 'max-min',
    })),
  };
}

export function secondVersionAdapter(json: JsonMCDAv2): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 2,
    colors: json.colors,
    layers: json.layers.map((l) => ({ ...l, normalization: 'max-min' })),
  };
}

export function thirdVersionAdapter(json: JsonMCDAv3): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 3,
    colors: json.colors,
    layers: json.layers,
  };
}
