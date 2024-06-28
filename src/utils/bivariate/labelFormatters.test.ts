import { expect, describe, it } from 'vitest';
import { hasUnits, formatBivariateAxisLabel } from './labelFormatters';
import type { Axis } from '~utils/bivariate';

describe('BivariateLegend labels formatting', () => {
  it('hasUnits', () => {
    expect(hasUnits(null)).toEqual(false);
    expect(hasUnits('other')).toEqual(false);
    expect(hasUnits('area')).toEqual(true);
  });

  describe('formatBivariateAxisLabel', () => {
    it('no numerator unit - hide units', () => {
      const quotients: Axis['quotients'] = [
        {
          name: 'man_distance_to_hospital',
          label: 'Man-distance to hospitals',
          direction: [['good'], ['bad']],
          unit: {
            id: 'other',
            shortName: null,
            longName: null,
          },
        },
        {
          name: 'total_road_length',
          label: 'Total road length',
          direction: [['unimportant'], ['important']],
          unit: {
            id: 'km',
            shortName: 'km',
            longName: 'kilometers',
          },
        },
      ];
      expect(formatBivariateAxisLabel(quotients)).toEqual(
        'Man-distance to hospitals to Total road length',
      );
    });

    it('numerator unit + denominator unit - one', () => {
      const quotients: Axis['quotients'] = [
        {
          name: 'avg_ndvi',
          label: 'NDVI (avg)',
          direction: [['bad'], ['good']],
          unit: {
            id: 'index',
            shortName: 'index',
            longName: 'index',
          },
        },
        {
          name: 'one',
          label: '1',
          direction: [['neutral'], ['neutral']],
          unit: {
            id: null,
            shortName: null,
            longName: null,
          },
        },
      ];
      expect(formatBivariateAxisLabel(quotients)).toEqual('NDVI (avg) (index)');
    });

    it('numerator unit + no denominator unit - show only numerator unit', () => {
      const quotients: Axis['quotients'] = [
        {
          name: 'avg_ndvi',
          label: 'NDVI (avg)',
          direction: [['bad'], ['good']],
          unit: {
            id: 'index',
            shortName: 'index',
            longName: 'index',
          },
        },
        {
          name: 'Test',
          label: 'Test',
          direction: [['neutral'], ['neutral']],
          unit: {
            id: null,
            shortName: null,
            longName: null,
          },
        },
      ];
      expect(formatBivariateAxisLabel(quotients)).toEqual('NDVI (avg) to Test (index)');
    });

    it('other cases', () => {
      const quotients: Axis['quotients'] = [
        {
          name: 'total_road_length',
          label: 'Total road length',
          direction: [['unimportant'], ['important']],
          unit: {
            id: 'km',
            shortName: 'km',
            longName: 'kilometers',
          },
        },
        {
          name: 'population',
          label: 'Population',
          direction: [['unimportant'], ['important']],
          unit: {
            id: 'ppl',
            shortName: 'ppl',
            longName: 'people',
          },
        },
      ];
      expect(formatBivariateAxisLabel(quotients)).toEqual(
        'Total road length to Population (km/ppl)',
      );
    });
  });
});
