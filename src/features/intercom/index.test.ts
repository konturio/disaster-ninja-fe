/**
 * @vitest-environment happy-dom
 */
import { expect, test, vi } from 'vitest';
import { configRepo } from '~core/config';
import { shutdownIntercom } from './index';

vi.mock('~core/config', () => {
  return {
    configRepo: {
      getIntercomSettings: vi.fn(() => ({ intercomAppId: 'abc' })),
    },
  };
});

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
