/**
 * @vitest-environment happy-dom
 */
vi.mock('~core/config', () => ({
  configRepo: {
    getIntercomSettings: vi.fn(() => ({ intercomAppId: 'abc' })),
  },
}));

import { expect, test, vi } from 'vitest';
import { shutdownIntercom } from './index';

test('shutdownIntercom clears session and calls Intercom shutdown', () => {
  globalThis.Intercom = vi.fn();
  (document as any).cookie = 'intercom-session-abc=value';
  // also set some settings to ensure they are removed
  (globalThis as any).intercomSettings = { email: 'a@b.c' };

  shutdownIntercom();

  expect(globalThis.Intercom).toHaveBeenCalledWith('shutdown');
  expect(document.cookie).not.toContain('intercom-session-abc=');
  expect((globalThis as any).intercomSettings).toBeUndefined();
});
