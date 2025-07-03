import { describe, expect, test, vi, beforeEach } from 'vitest';
import { store } from '~core/store/store';
import { episodesTimeline } from './episodesTimeline';

beforeEach(() => {
  // metrics dispatch relies on dispatchEvent existing
  if (typeof globalThis.dispatchEvent !== 'function') {
    // @ts-ignore
    globalThis.dispatchEvent = vi.fn();
  }
});

describe('episodesTimeline', () => {
  test('resetZoom triggers fit on imperative api', () => {
    const api = { fit: vi.fn() };
    store.dispatch(episodesTimeline.setImperativeApi(api));
    store.dispatch(episodesTimeline.resetZoom());
    expect(api.fit).toHaveBeenCalledTimes(1);
  });
});
