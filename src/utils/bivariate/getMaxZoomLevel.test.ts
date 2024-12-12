import { describe, expect, it } from 'vitest';
import { getMaxNumeratorZoomLevel } from './getMaxZoomLevel';
import type { Indicator } from '~utils/bivariate';

describe('getMaxIndicatorsZoomLevel(', () => {
  it('must return the biggest zoom level of all numerator that have maxZoom property', () => {
    expect(
      getMaxNumeratorZoomLevel(
        [axisWithZoomLevels(11, 14), axisWithZoomLevels(9, 14)],
        15,
      ),
    ).toEqual(11);
  });

  it('must return fallback value if no numerators have maxZoom property', () => {
    expect(
      getMaxNumeratorZoomLevel(
        [axisWithZoomLevels(undefined, 7), axisWithZoomLevels(undefined, 9)],
        15,
      ),
    ).toEqual(15);
  });

  it('must return the biggest maxZoom value if at least one numerator has maxZoom property', () => {
    expect(
      getMaxNumeratorZoomLevel(
        [axisWithZoomLevels(undefined, 14), axisWithZoomLevels(9, 14)],
        20,
      ),
    ).toEqual(9);
  });
});

function axisWithZoomLevels(
  numeratorMaxZoom: number | undefined,
  denominatorMaxZoom?: number | undefined,
): Indicator[] {
  return [
    {
      name: 'indicator_numerator',
      label: 'Numerator label',
      unit: {
        id: 'celc_deg',
        shortName: '°C',
        longName: 'degrees Celsius',
      },
      direction: [['unimportant'], ['important']],
      maxZoom: numeratorMaxZoom,
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
      maxZoom: denominatorMaxZoom,
    },
  ];
}
