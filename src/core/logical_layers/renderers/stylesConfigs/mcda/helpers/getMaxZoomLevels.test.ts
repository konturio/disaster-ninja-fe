import { describe, expect, it } from 'vitest';
import { getMaxIndicatorsZoomLevel } from './getMaxZoomLevel';
import type { Indicator } from '~utils/bivariate';

describe('getMaxIndicatorsZoomLevel(', () => {
  it('must return the biggest zoom level if all indicators have maxZoom property', () => {
    expect(getMaxIndicatorsZoomLevel(TEST_INDICATORS, 14)).toEqual(20);
  });

  it('must return fallback value if no indicators have maxZoom property', () => {
    const indicatorsWithoutZoomLevel = structuredClone(TEST_INDICATORS);
    indicatorsWithoutZoomLevel[0].maxZoom = undefined;
    indicatorsWithoutZoomLevel[1].maxZoom = undefined;
    expect(getMaxIndicatorsZoomLevel(indicatorsWithoutZoomLevel, 14)).toEqual(14);
  });

  it('must return the biggest zoom value if at least one indicator has maxZoom property', () => {
    const indicatorsWithSingleZoomLevel = structuredClone(TEST_INDICATORS);
    indicatorsWithSingleZoomLevel[0].maxZoom = undefined;
    expect(getMaxIndicatorsZoomLevel(indicatorsWithSingleZoomLevel, 14)).toEqual(9);
  });
});

const TEST_INDICATORS: Indicator[] = [
  {
    name: 'indicator_numerator',
    label: 'Numerator label',
    unit: {
      id: 'celc_deg',
      shortName: '°C',
      longName: 'degrees Celsius',
    },
    direction: [['unimportant'], ['important']],
    maxZoom: 20,
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
    maxZoom: 9,
  },
];
