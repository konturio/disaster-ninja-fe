import { describe, it, expect, vi } from 'vitest';

// Mock mapListeners to capture listener registration
vi.mock('~core/shared_state/mapListeners', () => ({
  registerMapListener: vi.fn(() => () => {}),
}));

import { registerMapListener } from '~core/shared_state/mapListeners';
import { MapRulerRenderer } from './MapRulerRenderer';

describe('MapRulerRenderer', () => {
  it('registers high priority listeners to block map interactions', () => {
    const renderer = new MapRulerRenderer('test');

    renderer.addClickListener();
    const calls = vi.mocked(registerMapListener).mock.calls;
    expect(
      calls.length,
      'Map ruler should register click and mousemove listeners to disable map interactivity',
    ).toBe(2);
    expect(calls[0][0], 'First listener must handle click events').toBe('click');
    expect(
      calls[0][2],
      'Click listener priority must be 100 to block other handlers while measuring',
    ).toBe(100);
    expect(calls[1][0], 'Second listener must handle mousemove events').toBe('mousemove');
    expect(
      calls[1][2],
      'Mousemove listener priority must be 100 to block other handlers while measuring',
    ).toBe(100);
  });
});
