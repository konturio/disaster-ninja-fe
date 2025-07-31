/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@konturio/ui-kit', () => ({
  Legend: vi.fn(() => null),
}));

vi.mock('../../utils/bivariate', () => ({
  formatBivariateAxisLabel: () => 'lbl',
  invertClusters: (s: any) => s,
}));

import { Legend as MockLegend } from '@konturio/ui-kit';
import { BivariateLegend } from './BivariateLegend';

const legend = {
  type: 'bivariate',
  steps: [],
  axis: {
    x: {
      label: '',
      quotients: [
        {
          direction: 'a',
          numerator: { label: '', unit: { id: '' } },
          denominator: { label: '', unit: { id: '' } },
        },
      ],
    },
    y: {
      label: '',
      quotients: [
        {
          direction: 'b',
          numerator: { label: '', unit: { id: '' } },
          denominator: { label: '', unit: { id: '' } },
        },
      ],
    },
  },
} as any;

describe('BivariateLegend', () => {
  test('uses fallback axis labels when missing', () => {
    render(<BivariateLegend legend={legend} />);
    const axis = (MockLegend as any).mock.calls[0][0].axis;
    expect(axis.x.label).toBe('lbl');
    expect(axis.y.label).toBe('lbl');
  });
});
