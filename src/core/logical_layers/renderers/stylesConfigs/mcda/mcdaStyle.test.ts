import { describe, expect, it, vi } from 'vitest';
import { filterSetup } from './mcdaStyle';
import type { MCDAConfig, MCDALayer } from './types';

describe('createMCDAStyle', () => {
  describe('filterSetup()', () => {
    it('creates correct filter when both MCDA layers have outliers === "as_on_limits"', () => {
      const result = filterSetup([layer1, layer2]);
      expect(result).toMatchSnapshot();
    });

    it('creates correct filter when one of the MCDA layers has outliers === "exclude"', () => {
      const result = filterSetup([layer1, { ...layer2, outliers: 'exclude' }]);
      expect(result).toMatchSnapshot();
    });
  });
});

const layer1: MCDALayer = {
  id: 'hazardous_days_count|one',
  name: 'Exposure: all disaster types (days)',
  axis: ['hazardous_days_count', 'one'],
  indicators: [],
  unit: 'days',
  range: [100, 366],
  sentiment: ['bad', 'good'],
  outliers: 'as_on_limits',
  coefficient: 1,
  transformationFunction: 'no',
  normalization: 'max-min',
};

const layer2: MCDALayer = {
  id: 'population|area_km2',
  name: 'Population (ppl/km²)',
  axis: ['population', 'area_km2'],
  indicators: [],
  outliers: 'as_on_limits',
  unit: 'ppl/km²',
  range: [100, 46200],
  sentiment: ['bad', 'good'],
  coefficient: 1,
  transformationFunction: 'no',
  normalization: 'max-min',
};
