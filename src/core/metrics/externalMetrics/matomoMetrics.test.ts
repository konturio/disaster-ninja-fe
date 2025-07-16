/**
 * @vitest-environment happy-dom
 */
import { describe, test, expect, vi } from 'vitest';
import { configRepo } from '~core/config/__mocks__/_configMock';
import { METRICS_EVENT } from '../constants';
import { MatomoMetrics } from './matomoMetrics';

const URL = 'https://matomo.kontur.io/js/container_R9VsLLth.js';

function prepareDom() {
  document.head.innerHTML = '';
  const dummy = document.createElement('script');
  document.head.appendChild(dummy);
  (globalThis as any)._mtm = [];
}

describe('MatomoMetrics', () => {
  test('pushes events to _mtm data layer', () => {
    prepareDom();
    configRepo.get = vi.fn(() => ({ id: 'test_app', matomoContainerUrl: URL })) as any;
    const origCreate = document.createElement;
    const createSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string) => origCreate.call(document, tag));
    const metric = new MatomoMetrics();
    metric.init('app', 'route');
    createSpy.mockRestore();

    const mtm: any[] = (globalThis as any)._mtm;
    expect(Array.isArray(mtm)).toBe(true);

    const evt = new CustomEvent(METRICS_EVENT, { detail: { name: 'test_event' } });
    globalThis.dispatchEvent(evt);

    expect(mtm.some((e) => e.event === 'test_event')).toBe(true);
    metric.cleanup();
  });

  test('does not initialize twice', () => {
    prepareDom();
    configRepo.get = vi.fn(() => ({ id: 'test_app', matomoContainerUrl: URL })) as any;
    const metric = new MatomoMetrics();
    metric.init('a', 'b');
    const scriptsAfterFirst = document.querySelectorAll(`script[src="${URL}"]`).length;
    metric.init('a', 'b');
    const scriptsAfterSecond = document.querySelectorAll(`script[src="${URL}"]`).length;
    expect(scriptsAfterFirst).toBe(1);
    expect(scriptsAfterSecond).toBe(1);
    metric.cleanup();
  });

  test('dispatchEvent handles errors', () => {
    prepareDom();
    configRepo.get = vi.fn(() => {
      throw new Error('boom');
    }) as any;
    const metric = new MatomoMetrics();
    metric.init('a', 'b');
    (globalThis as any)._mtm = {
      push: () => {
        throw new Error('fail');
      },
    };
    expect(() => metric.dispatchEvent('x')).not.toThrow();
    metric.cleanup();
  });

  test('cleanup removes listener', () => {
    prepareDom();
    configRepo.get = vi.fn(() => ({ id: 'test_app', matomoContainerUrl: URL })) as any;
    const metric = new MatomoMetrics();
    metric.init('a', 'b');
    metric.cleanup();
    (globalThis as any)._mtm = [];
    const evt = new CustomEvent(METRICS_EVENT, { detail: { name: 'after-cleanup' } });
    globalThis.dispatchEvent(evt);
    const mtm: any[] = (globalThis as any)._mtm;
    expect(mtm.some((e) => e.event === 'after-cleanup')).toBe(false);
  });
});
