import { expect, describe, it } from 'vitest';
import { extractAvailableDenominators } from '../extractAvailableDenominators';

type AxisLike = { quotient: [string, string] };
describe('Find all available denominators', () => {
  it('Its find something', () => {
    const correlationRates: { x: AxisLike; y: AxisLike }[] = [
      {
        x: {
          quotient: ['foo', 'area'],
        },
        y: {
          quotient: ['bar', 'views'],
        },
      },
      {
        x: {
          quotient: ['foo', 'area'],
        },
        y: {
          quotient: ['baz', 'views'],
        },
      },
      {
        x: {
          quotient: ['bar', 'area'],
        },
        y: {
          quotient: ['baz', 'views'],
        },
      },
    ];

    const denominators = extractAvailableDenominators(correlationRates);
    expect(denominators).toEqual([['area'], ['views']]);
  });
});
