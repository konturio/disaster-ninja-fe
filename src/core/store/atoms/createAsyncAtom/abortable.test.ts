import { expect, test, describe, vi, beforeEach } from 'vitest';
import { wait } from '~utils/test';
import { abortable, isAbortError } from './abort-error';

describe('Add abort to any promise', () => {
  test('Promise can be canceled outside', async () => {
    const controller = new AbortController();
    const promise = wait(100);
    try {
      setTimeout(() => controller.abort(), 1000);
      await abortable(controller, promise);
    } catch (e) {
      expect(isAbortError(e)).toBe(true);
    }
    expect.hasAssertions();
  });

  test('Promise can be canceled inside', async () => {
    const controller = new AbortController();
    const promise = new Promise((res, rej) => {
      setTimeout(() => controller.abort(), 1000);
    });

    try {
      await abortable(controller, promise);
    } catch (e) {
      expect(isAbortError(e)).toBe(true);
    }
    expect.hasAssertions();
  });
});
