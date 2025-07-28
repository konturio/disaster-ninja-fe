import { describe, expect, it } from 'vitest';
import { deepEqual } from 'fast-equals';
import {
  sentimentDefault,
  sentimentReversed,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { createBivariateColorsForMVA } from './createBivariateColorsForMVA';
import type { ColorTheme } from '~core/types';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export const DEFAULT_COLORS: ColorTheme = [
  {
    id: 'A1',
    color: 'rgba(232, 232, 157, 0.5)',
  },
  {
    id: 'A3',
    color: 'rgba(228, 26, 28, 0.5)',
  },
  {
    id: 'C1',
    color: 'rgba(166, 239, 179, 0.5)',
  },
  {
    id: 'C3',
    color: 'rgba(102, 154, 112, 0.5)',
  },
];

const layer: MCDALayer = {
  id: '',
  name: '',
  axis: ['', ''],
  indicators: [],
  outliers: 'clamp',
  unit: '',
  range: [0, 100],
  sentiment: ['bad', 'good'],
  coefficient: 1,
  transformationFunction: 'no',
  normalization: 'max-min',
};

describe('createBivariateColorsForMVA', () => {
  it('should return default color scheme if both score and base have one layer with direct sentiment', () => {
    const scoreLayers = [{ ...layer, sentiment: sentimentDefault }];
    const baseLayer = [{ ...layer, sentiment: sentimentDefault }];
    expect(
      deepEqual(
        createBivariateColorsForMVA(scoreLayers, baseLayer, DEFAULT_COLORS),
        DEFAULT_COLORS,
      ),
    ).toBeTruthy();
  });

  it('should return horizontally reversed color scheme if base hase one layer with reversed sentiment', () => {
    const scoreLayers = [{ ...layer, sentiment: sentimentDefault }];
    const baseLayer = [{ ...layer, sentiment: sentimentReversed }];
    expect(
      deepEqual(createBivariateColorsForMVA(scoreLayers, baseLayer, DEFAULT_COLORS), [
        {
          id: 'A1',
          color: 'rgba(228, 26, 28, 0.5)',
        },
        {
          id: 'A3',
          color: 'rgba(232, 232, 157, 0.5)',
        },
        {
          id: 'C1',
          color: 'rgba(102, 154, 112, 0.5)',
        },
        {
          id: 'C3',
          color: 'rgba(166, 239, 179, 0.5)',
        },
      ]),
    ).toBeTruthy();
  });

  it('should return vertically reversed color scheme if score has one layer with reversed sentiment', () => {
    const scoreLayers = [{ ...layer, sentiment: sentimentReversed }];
    const baseLayer = [{ ...layer, sentiment: sentimentDefault }];
    expect(
      deepEqual(createBivariateColorsForMVA(scoreLayers, baseLayer, DEFAULT_COLORS), [
        {
          id: 'A1',
          color: 'rgba(166, 239, 179, 0.5)',
        },
        {
          id: 'A3',
          color: 'rgba(102, 154, 112, 0.5)',
        },
        {
          id: 'C1',
          color: 'rgba(232, 232, 157, 0.5)',
        },
        {
          id: 'C3',
          color: 'rgba(228, 26, 28, 0.5)',
        },
      ]),
    ).toBeTruthy();
  });

  it('should return vertically and horizontally reversed color scheme if both score and base have one layer with reversed sentiment', () => {
    const scoreLayers = [{ ...layer, sentiment: sentimentReversed }];
    const baseLayer = [{ ...layer, sentiment: sentimentReversed }];
    expect(
      deepEqual(createBivariateColorsForMVA(scoreLayers, baseLayer, DEFAULT_COLORS), [
        {
          id: 'A1',
          color: 'rgba(102, 154, 112, 0.5)',
        },
        {
          id: 'A3',
          color: 'rgba(166, 239, 179, 0.5)',
        },
        {
          id: 'C1',
          color: 'rgba(228, 26, 28, 0.5)',
        },
        {
          id: 'C3',
          color: 'rgba(232, 232, 157, 0.5)',
        },
      ]),
    ).toBeTruthy();
  });
});
