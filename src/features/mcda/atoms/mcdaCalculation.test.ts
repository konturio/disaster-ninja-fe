import { test, expect, beforeEach } from 'vitest';
import { layerNormalized } from './mcdaCalculation';

test('layerNormalized calculations is correct for good bad sentiments', () => {
  const result = layerNormalized({
    axis: ['axisA', 'axisB'],
    range: [111, 333],
    sentiment: ['good', 'bad'],
    coefficient: 7,
  });

  expect(result).toMatchSnapshot();
});

test('layerNormalized calculations is correct for bad good sentiments', () => {
  const result = layerNormalized({
    axis: ['axisA', 'axisB'],
    range: [111, 333],
    sentiment: ['bad', 'good'],
    coefficient: 7,
  });

  expect(result).toMatchSnapshot();
});
