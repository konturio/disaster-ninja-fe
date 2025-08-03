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
  it('shows legend letter icon with matching color for Active mappers', () => {
    const step = {
      stepName: 'Active mappers',
      stepShape: 'circle',
      style: { 'text-color': '#ff0000' },
    } as any;
    const { container } = render(<SimpleLegendStep step={step} />);
    const letter = container.querySelector('svg text');
    expect(letter, 'Active mappers should render letter icon').not.toBeNull();
    expect(
      letter?.textContent,
      'Active mappers letter icon should display first letter A',
    ).toBe('A');
    expect(
      letter?.getAttribute('fill'),
      'Active mappers letter icon color should match legend text color #ff0000',
    ).toBe('#ff0000');
  });

  it('shows legend letter icon with matching color for Possibly local mappers', () => {
    const step = {
      stepName: 'Possibly local mappers',
      stepShape: 'circle',
      style: { 'text-color': '#00ff00' },
    } as any;
    const { container } = render(<SimpleLegendStep step={step} />);
    const letter = container.querySelector('svg text');
    expect(letter, 'Possibly local mappers should render letter icon').not.toBeNull();
    expect(
      letter?.textContent,
      'Possibly local mappers letter icon should display first letter P',
    ).toBe('P');
    expect(
      letter?.getAttribute('fill'),
      'Possibly local mappers letter icon color should match legend text color #00ff00',
    ).toBe('#00ff00');
  });
});
