import { test, expect } from 'vitest';
import { calculateLayerPipeline, inStyleCalculations, inViewCalculations } from '.';

// @ts-ignore
const calculateLayerStyle = calculateLayerPipeline(inStyleCalculations, (axis) => ({
  num: ['get', axis.num],
  den: ['get', axis.den],
}));

test('style correct for good bad sentiments', () => {
  const result = calculateLayerStyle({
    id: 'test',
    name: 'TEST',
    axis: ['axisA', 'axisB'],
    range: [111, 333],
    sentiment: ['good', 'bad'],
    coefficient: 7,
    transformationFunction: 'no',
    normalization: 'max-min',
  });

  expect(result).toMatchSnapshot();
});

test('style correct for bad good sentiments', () => {
  const result = calculateLayerStyle({
    id: 'test',
    name: 'TEST',
    axis: ['axisA', 'axisB'],
    range: [111, 333],
    sentiment: ['bad', 'good'],
    coefficient: 7,
    transformationFunction: 'no',
    normalization: 'max-min',
  });

  expect(result).toMatchSnapshot();
});

const calculateNumber = calculateLayerPipeline(inViewCalculations, (axis) => ({
  num: 10,
  den: 1,
}));

test('Transformations correct: square_root', () => {
  const result = calculateNumber({
    id: 'test',
    name: 'TEST',
    axis: ['axisA', 'axisB'],
    range: [0, 100],
    sentiment: ['bad', 'good'],
    coefficient: 1,
    transformationFunction: 'square_root',
    normalization: 'max-min',
  });

  expect(result).toBe(0.31622776601683794);
});

test('Transformations correct: natural_logarithm', () => {
  const result = calculateNumber({
    id: 'test',
    name: 'TEST',
    axis: ['axisA', 'axisB'],
    range: [0, 100],
    sentiment: ['bad', 'good'],
    coefficient: 1,
    transformationFunction: 'natural_logarithm',
    normalization: 'max-min',
  });

  expect(result).toBe(0.5195737064824407);
});
