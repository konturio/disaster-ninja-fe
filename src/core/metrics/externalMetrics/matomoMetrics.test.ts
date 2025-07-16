/**
 * @vitest-environment happy-dom
 */
import { describe, expect, test, vi } from 'vitest';
import { configRepo } from '~core/config';
import { METRICS_EVENT } from '../constants';
import { MatomoMetrics } from './matomoMetrics';

describe('MatomoMetrics', () => {
  test('injects script using config url', () => {
    vi.spyOn(configRepo, 'get').mockReturnValue({
      id: 'atlas',
      matomoContainerUrl: 'https://matomo.example.com/container.js',
    } as any);
    document.head.innerHTML = '<script></script>';
    const metrics = new MatomoMetrics();
    metrics.init('atlas', 'home', () => true);
    const scripts = document.getElementsByTagName('script');
    expect(scripts[0]?.getAttribute('src')).toBe(
      'https://matomo.example.com/container.js',
    );
  });

  test('dispatches events to data layer', () => {
    const pushSpy = vi.fn();
    (globalThis as any)._mtm = { push: pushSpy };
    vi.spyOn(configRepo, 'get').mockReturnValue({
      id: 'atlas',
      matomoContainerUrl: 'https://matomo.example.com/container.js',
    } as any);
    document.head.innerHTML = '<script></script>';
    const metrics = new MatomoMetrics();
    metrics.init('atlas', 'home', () => true);
    metrics['ready'] = true;
    globalThis.dispatchEvent(
      new CustomEvent(METRICS_EVENT, { detail: { name: 'test' } }),
    );
    expect(pushSpy).toHaveBeenCalledWith({ event: 'test', app_id: 'atlas' });
  });
});
