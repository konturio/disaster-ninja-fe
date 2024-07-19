import { test, expect } from 'vitest';
import { calculateLayerPipeline, inStyleCalculations, inViewCalculations } from '.';
import type { MCDALayer } from '../types';

// @ts-expect-error types compatibility
const calculateLayerStyle = calculateLayerPipeline(inStyleCalculations, (axis) => ({
  num: ['get', axis.num],
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

const calculateNumber = calculateLayerPipeline(inViewCalculations, (axis) => ({
  num: 10,
  den: 1,
}));

test('Transformations correct: square_root', () => {
  const result = calculateNumber({
    ...TEST_MCDA_LAYER,
    transformationFunction: 'square_root',
  });

  expect(result).toBe(0.31622776601683794);
});

test('Transformations correct: cube_root', () => {
  const result = calculateNumber({
    ...TEST_MCDA_LAYER,
    transformationFunction: 'cube_root',
  });

  expect(result).toBe(0.46415888336127786);
});

test('Transformations correct: natural_logarithm', () => {
  const result = calculateNumber({
    ...TEST_MCDA_LAYER,
    transformationFunction: 'natural_logarithm',
  });

  expect(result).toBe(0.5195737064824407);
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
    },
    {
      name: 'indicator_denominator',
      label: 'Denominator label',
      unit: {
        id: 'null',
        shortName: null,
        longName: null,
      },
    },
  ],
  range: [0, 100],
  sentiment: ['bad', 'good'],
  coefficient: 1,
  outliers: 'as_on_limits',
  transformationFunction: 'no',
  normalization: 'max-min',
  unit: '',
};
