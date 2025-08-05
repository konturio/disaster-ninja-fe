import { test, expect } from 'vitest';
import { calculateLayerPipeline } from '.';
import type { MCDALayer } from '../types';

const calculateLayerStyle = calculateLayerPipeline('layerStyle', (axis) => ({
  // @ts-expect-error types compatibility
  num: ['get', axis.num],
  // @ts-expect-error types compatibility
  den: ['get', axis.den],
}));

test('style correct for good bad sentiments', () => {
  const result = calculateLayerStyle({ ...TEST_MCDA_LAYER, sentiment: ['good', 'bad'] });

  expect(result).toMatchSnapshot();
});

test('style correct for bad good sentiments', () => {
  const result = calculateLayerStyle(TEST_MCDA_LAYER);

  expect(result).toMatchSnapshot();
});

const calculateNumber = calculateLayerPipeline('view', (axis) => ({
  num: 10,
  den: 1,
}));

const calculateNegativeNumber = calculateLayerPipeline('view', (axis) => ({
  num: -10,
  den: 1,
}));

test('Transformations correct: square_root', () => {
  const result = calculateNumber({
    ...TEST_MCDA_LAYER,
    transformationFunction: 'square_root',
  });

  expect(result).toBe(0.31622776601683794);
});

test('Transformations correct: square_root for negative values', () => {
  const result = calculateNegativeNumber({
    ...TEST_MCDA_LAYER,
    transformationFunction: 'square_root',
    range: [-100, 0],
  });

  expect(result).toBe(0.683772233983162);
});

test('Transformations correct: cube_root', () => {
  const result = calculateNumber({
    ...TEST_MCDA_LAYER,
    transformationFunction: 'cube_root',
  });

  expect(result).toBe(0.46415888336127786);
});

test('Transformations correct: log', () => {
  const result = calculateNegativeNumber({
    ...TEST_MCDA_LAYER,
    range: [-20, 100],
    transformationFunction: 'log',
  });

  expect(result).toBe(0.2610207200288388);
});

test('Transformations correct: log_epsilon', () => {
  const result = calculateNegativeNumber({
    ...TEST_MCDA_LAYER,
    range: [-20, 100],
    transformationFunction: 'log_epsilon',
  });

  expect(result).toBe(0.27023815442731974);
});

const TEST_MCDA_LAYER: MCDALayer = {
  id: 'test',
  name: 'TEST',
  axis: ['indicator_numerator', 'indicator_denominator'],
  indicators: [
    {
      name: 'indicator_numerator',
      label: 'Numerator label',
      unit: {
        id: 'celc_deg',
        shortName: '°C',
        longName: 'degrees Celsius',
      },
      direction: [['unimportant'], ['important']],
    },
    {
      name: 'indicator_denominator',
      label: 'Denominator label',
      unit: {
        id: 'null',
        shortName: null,
        longName: null,
      },
      direction: [['unimportant'], ['important']],
    },
  ],
  range: [0, 100],
  sentiment: ['bad', 'good'],
  coefficient: 1,
  outliers: 'clamp',
  transformationFunction: 'no',
  normalization: 'max-min',
  unit: '',
  datasetStats: { minValue: -30, maxValue: 100, mean: 0, stddev: 10 },
};
