import type { MCDAConfig } from '../types';
import type { JsonMCDAv1, JsonMCDAv2 } from './types';

export function firstVersionAdapter(json: JsonMCDAv1): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 1,
    colors: json.colors,
    layers: json.layers.map((l) => ({ ...l, transformationFunction: 'no' })),
  };
}

export function secondVersionAdapter(json: JsonMCDAv2): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 2,
    colors: json.colors,
    layers: json.layers,
  };
}
