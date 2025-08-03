/* @vitest-environment happy-dom */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DisasterShield } from './DisasterShield';

describe('DisasterShield', () => {
  it('renders earthquake magnitude with correct color', () => {
    render(<DisasterShield eventType="EARTHQUAKE" magnitude={8.6} />);
    const el = screen.getByText('M 8.6');
    expect(el, 'Earthquake shield should show magnitude text').toBeTruthy();
    expect(
      el.getAttribute('style'),
      'Earthquake magnitude 8.6 should map to #FF6600',
    ).toContain('background-color: #FF6600');
  });

  it('renders cyclone category with correct color', () => {
    render(<DisasterShield eventType="CYCLONE" cycloneCategory="2" />);
    const el = screen.getByText('Cat 2');
    expect(el, 'Cyclone shield should show category text').toBeTruthy();
    expect(
      el.getAttribute('style'),
      'Cyclone category 2 should map to #FFB800',
    ).toContain('background-color: #FFB800');
  });
});
