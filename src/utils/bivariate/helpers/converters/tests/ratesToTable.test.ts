import { expect, describe, it } from 'vitest';
import { ratesToTable } from '../ratesToTable';
import type { CorrelationRate } from '../../../types/stat.types';

describe('statsToMatrix convert various datasets into matrix without errors', () => {
  it('Create correct 3x3 matrix', () => {
    /**
     *     |  bar  |  baz  |   / views
     * -----------------------------
     * foo |    .3   0.44
     * bar |  null   0.455
     * -----------------------------
     * / area
     */
    const correlationRates: CorrelationRate[] = [
      {
        x: {
          steps: [{ value: 10 }, { value: 30 }, { value: 50 }],
          quotient: ['foo', 'area'],
        },
        y: {
          steps: [{ value: 1 }, { value: 3 }, { value: 5 }],
          quotient: ['bar', 'views'],
        },
        rate: 0.3,
      },
      {
        x: {
          steps: [{ value: 10 }, { value: 30 }, { value: 50 }],
          quotient: ['foo', 'area'],
        },
        y: {
          steps: [{ value: 1 }, { value: 3 }, { value: 5 }],
          quotient: ['baz', 'views'],
        },
        rate: 0.44,
      },
      {
        x: {
          steps: [{ value: 10 }, { value: 30 }, { value: 50 }],
          quotient: ['bar', 'area'],
        },
        y: {
          steps: [{ value: 1 }, { value: 3 }, { value: 5 }],
          quotient: ['baz', 'views'],
        },
        rate: 0.455,
      },
    ];

    const matrix = ratesToTable(correlationRates);

    expect(matrix).toEqual(
      /* eslint-disable */
      {
        matrix: [
          [0.3, null],
          [0.44, 0.455],
        ],
        x: [
          {
            id: 'foo',
            quality: undefined,
          },
          {
            id: 'bar',
            quality: undefined,
          },
        ],
        y: [
          {
            id: 'bar',
            quality: undefined,
          },
          {
            id: 'baz',
            quality: undefined,
          },
        ],
      },
      /* eslint-enable */
    );
  });
});
