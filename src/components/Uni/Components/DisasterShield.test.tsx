/* @vitest-environment happy-dom */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DisasterShield } from './DisasterShield';

describe('DisasterShield', () => {
  it('renders earthquake magnitude with correct color', () => {
    render(<DisasterShield eventType="EARTHQUAKE" magnitude={8.6} />);
    const el = screen.getByText('M 8.6');
    expect(el, 'Earthquake shield should show magnitude text').toBeTruthy();
    const style = (el.getAttribute('style') ?? '').toLowerCase();
    expect(style, 'Earthquake magnitude 8.6 should map text color to #FF6600').toContain(
      'color: #ff6600',
    );
    expect(style, 'Earthquake magnitude 8.6 should have 10% opaque background').toContain(
      'background-color: #ff66001a',
    );
  });

  it('renders cyclone category with correct color', () => {
    render(<DisasterShield eventType="CYCLONE" cycloneCategory="2" />);
    const el = screen.getByText('Cat 2');
    expect(el, 'Cyclone shield should show category text').toBeTruthy();
    const style = (el.getAttribute('style') ?? '').toLowerCase();
    expect(style, 'Cyclone category 2 should map text color to #FFB800').toContain(
      'color: #ffb800',
    );
    expect(style, 'Cyclone category 2 should have 10% opaque background').toContain(
      'background-color: #ffb8001a',
    );
  });
});
