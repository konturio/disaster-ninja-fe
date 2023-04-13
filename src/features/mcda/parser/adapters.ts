import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { JsonMCDAv1, JsonMCDAv2, JsonMCDAv3, JsonMCDAv4 } from './types';

export function firstVersionMigration(json: JsonMCDAv1): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 1,
    colors: {
      type: 'sentiments',
      parameters: json.colors,
    },
    layers: json.layers.map((l) => ({
      ...l,
      transformationFunction: 'no',
      normalization: 'max-min',
    })),
  };
}

export function secondVersionMigration(json: JsonMCDAv2): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 2,
    colors: {
      type: 'sentiments',
      parameters: json.colors,
    },
    layers: json.layers.map((l) => ({ ...l, normalization: 'max-min' })),
  };
}

export function thirdVersionMigration(json: JsonMCDAv3): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 3,
    colors: {
      type: 'sentiments',
      parameters: json.colors,
    },
    layers: json.layers,
  };
}

export function fourVersionMigration(json: JsonMCDAv4): MCDAConfig {
  return {
    id: json.id ?? 'MCDA_layer',
    version: 4,
    colors: json.colors,
    layers: json.layers,
  };
}
