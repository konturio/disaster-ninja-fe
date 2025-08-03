import { describe, expect, it } from 'vitest';
import { filterSetup } from './mcdaStyle';
import type { MCDALayer } from './types';

describe('createMCDAStyle', () => {
  describe('filterSetup()', () => {
    it('creates correct filter when both MCDA layers have outliers === "clamp"', () => {
      const result = filterSetup([layer1, layer2]);
      expect(result).toMatchSnapshot();
    });

    it('creates correct filter when one of the MCDA layers has outliers === "hide"', () => {
      const result = filterSetup([layer1, { ...layer2, outliers: 'hide' }]);
      expect(result).toMatchSnapshot();
    });

    it('ignores hidden layers in filter', () => {
      const result = filterSetup([{ ...layer1, isHidden: true }, layer2]);
      const expected = filterSetup([layer2]);
      expect(result).toEqual(expected);
    });

    it('returns undefined when all layers are hidden', () => {
      const result = filterSetup([{ ...layer1, isHidden: true }]);
      expect(result).toBeUndefined();
    });
  });
});

const layer1: MCDALayer = {
  id: 'hazardous_days_count|one',
  name: 'Exposure: all disaster types (days)',
  axis: ['hazardous_days_count', 'one'],
  indicators: [
    {
      name: 'hazardous_days_count',
      label: 'Exposure: all disaster types',
      unit: {
        id: 'days',
        shortName: 'days',
        longName: 'days',
      },
      direction: [['unimportant'], ['important']],
    },
    {
      name: 'one',
      label: '1',
      unit: {
        id: null,
        shortName: null,
        longName: null,
      },
      direction: [['unimportant'], ['important']],
    },
  ],
  unit: 'days',
  range: [100, 366],
  sentiment: ['bad', 'good'],
  outliers: 'clamp',
  coefficient: 1,
  transformationFunction: 'no',
  normalization: 'max-min',
};

const layer2: MCDALayer = {
  id: 'population|area_km2',
  name: 'Population (ppl/km²)',
  axis: ['population', 'area_km2'],
  indicators: [
    {
      name: 'population',
      label: 'Population',
      unit: {
        id: 'ppl',
        shortName: 'ppl',
        longName: 'people',
      },
      direction: [['unimportant'], ['important']],
    },
  ],
  outliers: 'clamp',
  unit: 'ppl/km²',
  range: [100, 46200],
  sentiment: ['bad', 'good'],
  coefficient: 1,
  transformationFunction: 'no',
  normalization: 'max-min',
};
