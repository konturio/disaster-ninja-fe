/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { configRepo } from '~core/config';
import { METRICS_EVENT } from '../constants';
import { MatomoMetrics } from './matomoMetrics';

describe('MatomoMetrics', () => {
  const containerUrl = 'https://matomo.example.com/container.js';
  let metrics: MatomoMetrics;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(configRepo, 'get').mockReturnValue({
      id: 'atlas',
      matomoContainerUrl: containerUrl,
    } as any);
    document.head.innerHTML = '';
    metrics = new MatomoMetrics();
  });

  test('injects script using config url', () => {
    metrics.init('atlas', 'home');
    const script = document.head.querySelector(`script[src="${containerUrl}"]`);
    expect(script).not.toBeNull();
  });

  test('dispatches events to data layer', () => {
    const pushSpy = vi.fn();
    (globalThis as any)._mtm = { push: pushSpy };
    metrics.init('atlas', 'home');
    const script = document.head.querySelector(
      `script[src="${containerUrl}"]`,
    ) as HTMLScriptElement | null;
    script?.dispatchEvent(new Event('load'));
    globalThis.dispatchEvent(
      new CustomEvent(METRICS_EVENT, { detail: { name: 'test' } }),
    );
    expect(pushSpy).toHaveBeenCalledWith({ event: 'test', app_id: 'atlas' });
  });
});
