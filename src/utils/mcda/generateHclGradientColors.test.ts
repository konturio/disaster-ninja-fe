import { expect, it, test, describe } from 'vitest';
import { color as d3Color } from 'd3-color';
import { generateHclGradientColors } from './generateHclGradientColors';

describe('generateHclGradientColors', () => {
  const COLOR_START = '#FF000077';
  const COLOR_END = '#00FF0077';

  it('must generate an array of colors with size === steps number', () => {
    const stepsNumber = 10;
    const result = generateHclGradientColors(COLOR_START, COLOR_END, stepsNumber);
    expect(result.length).toEqual(stepsNumber);
    result.forEach((colorString) => {
      expect(d3Color(colorString)).toBeTruthy();
    });
  });

  test('the first and last values of the result must equal start and end color parameters', () => {
    const stepsNumber = 7;
    const result = generateHclGradientColors(COLOR_START, COLOR_END, stepsNumber);
    expect(result.length).toEqual(stepsNumber);
    expect(d3Color(result[0])?.formatHex8()?.toUpperCase()).toEqual(COLOR_START);
    expect(
      d3Color(result[stepsNumber - 1])
        ?.formatHex8()
        ?.toUpperCase(),
    ).toEqual(COLOR_END);
  });
});
