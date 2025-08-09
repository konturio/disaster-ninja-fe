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
  it.each([
    ['Active mappers', '#ff0000'],
    ['Possibly local mappers', '#00ff00'],
  ])('shows Figma letter icon with matching color for %s', (stepName, color) => {
    const step = {
      stepName,
      stepShape: 'letter',
      style: { 'text-color': color },
    } as any;
    const { container } = render(<SimpleLegendStep step={step} />);
    const svg = container.querySelector('svg');
    const path = svg?.querySelector('path');
    expect(svg, `${stepName} should render letter icon`).not.toBeNull();
    expect(
      path?.getAttribute('d')?.startsWith('M6 6H18V9.08508H16.769V8.53835'),
      `${stepName} should use Figma letter icon path`,
    ).toBe(true);
    expect(
      svg?.getAttribute('style') || '',
      `${stepName} letter icon color should match legend text color ${color}`,
    ).toContain(color);
  });
});
