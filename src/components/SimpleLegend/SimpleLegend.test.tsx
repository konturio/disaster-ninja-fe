/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@konturio/ui-kit', () => ({
  Text: ({ children }) => <span>{children}</span>,
}));

import { SimpleLegendStep } from './SimpleLegend';

describe('SimpleLegendStep', () => {
  it('shows Figma letter icon with matching color for Active mappers', () => {
    const step = {
      stepName: 'Active mappers',
      stepShape: 'circle',
      style: { 'text-color': '#ff0000' },
    } as any;
    const { container } = render(<SimpleLegendStep step={step} />);
    const svg = container.querySelector('svg');
    const path = svg?.querySelector('path');
    expect(svg, 'Active mappers should render letter icon').not.toBeNull();
    expect(
      path?.getAttribute('d')?.startsWith('M6 6H18V9.08508H16.769V8.53835'),
      'Active mappers should use Figma letter icon path',
    ).toBe(true);
    expect(
      svg?.getAttribute('style') || '',
      'Active mappers letter icon color should match legend text color #ff0000',
    ).toContain('#ff0000');
  });

  it('shows Figma letter icon with matching color for Possibly local mappers', () => {
    const step = {
      stepName: 'Possibly local mappers',
      stepShape: 'circle',
      style: { 'text-color': '#00ff00' },
    } as any;
    const { container } = render(<SimpleLegendStep step={step} />);
    const svg = container.querySelector('svg');
    const path = svg?.querySelector('path');
    expect(svg, 'Possibly local mappers should render letter icon').not.toBeNull();
    expect(
      path?.getAttribute('d')?.startsWith('M6 6H18V9.08508H16.769V8.53835'),
      'Possibly local mappers should use Figma letter icon path',
    ).toBe(true);
    expect(
      svg?.getAttribute('style') || '',
      'Possibly local mappers letter icon color should match legend text color #00ff00',
    ).toContain('#00ff00');
  });
});
