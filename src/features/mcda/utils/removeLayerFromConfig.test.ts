import { expect, test } from 'vitest';
import { DEFAULT_MCDA_COLORS_BY_SENTIMENT } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { removeLayerFromConfig } from './removeLayerFromConfig';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

const baseConfig: MCDAConfig = {
  id: 'mcda',
  name: 'mcda',
  version: 4,
  colors: DEFAULT_MCDA_COLORS_BY_SENTIMENT,
  layers: [
    {
      id: 'l1',
      name: 'Layer 1',
      axis: ['a1', 'b1'],
      indicators: [
        {
          name: 'a1',
          label: 'a1',
          direction: [['bad'], ['good']],
          unit: { id: null, longName: null, shortName: null },
        },
        {
          name: 'b1',
          label: 'b1',
          direction: [['bad'], ['good']],
          unit: { id: null, longName: null, shortName: null },
        },
      ],
      range: [0, 1],
      sentiment: ['bad', 'good'],
      outliers: 'clamp',
      coefficient: 1,
      transformationFunction: 'no',
      normalization: 'max-min',
      unit: 'u',
    },
    {
      id: 'l2',
      name: 'Layer 2',
      axis: ['a2', 'b2'],
      indicators: [
        {
          name: 'a2',
          label: 'a2',
          direction: [['bad'], ['good']],
          unit: { id: null, longName: null, shortName: null },
        },
        {
          name: 'b2',
          label: 'b2',
          direction: [['bad'], ['good']],
          unit: { id: null, longName: null, shortName: null },
        },
      ],
      range: [0, 1],
      sentiment: ['bad', 'good'],
      outliers: 'clamp',
      coefficient: 1,
      transformationFunction: 'no',
      normalization: 'max-min',
      unit: 'u',
    },
  ],
};

test('remove layer from MCDA config', () => {
  const updated = removeLayerFromConfig(baseConfig, 'l1');
  expect(updated.layers.length).toBe(1);
  expect(updated.layers[0].id).toBe('l2');
});
