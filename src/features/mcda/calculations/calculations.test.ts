import { test, expect } from 'vitest';
import { calculateLayerPipeline, inStyleCalculations } from '.';

// @ts-ignore
const calculateLayer = calculateLayerPipeline(inStyleCalculations, (axis) => ({
  num: ['get', axis.num],
  den: ['get', axis.den],
}));

test('calculateLayer calculations is correct for good bad sentiments', () => {
  const result = calculateLayer({
    axis: ['axisA', 'axisB'],
    range: [111, 333],
    sentiment: ['good', 'bad'],
    coefficient: 7,
    transformationFunction: 'no',
  });

  expect(result).toMatchSnapshot();
});

test('calculateLayer calculations is correct for bad good sentiments', () => {
  const result = calculateLayer({
    axis: ['axisA', 'axisB'],
    range: [111, 333],
    sentiment: ['bad', 'good'],
    coefficient: 7,
    transformationFunction: 'no',
  });

  expect(result).toMatchSnapshot();
});
