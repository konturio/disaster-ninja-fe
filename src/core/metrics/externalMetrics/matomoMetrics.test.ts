/**
 * @vitest-environment happy-dom
 */
import { test, expect } from 'vitest';
import { MatomoMetrics } from './matomoMetrics';
import { METRICS_EVENT } from '../constants';
import { configRepo } from '~core/config/__mocks__/_configMock';

test('matomo metrics pushes events to _mtm data layer', () => {
  const metric = new MatomoMetrics();
  // ensure script insertion does not fail when document has no scripts
  const dummy = document.createElement('script');
  document.head.appendChild(dummy);
  const origCreate = document.createElement.bind(document);
  document.createElement = (tag: string) => {
    if (tag === 'script') {
      const stub = origCreate('script');
      Object.defineProperty(stub, 'src', { set() {}, get() { return ''; } });
      return stub as HTMLScriptElement;
    }
    return origCreate(tag);
  };
  // ensure configRepo returns id
  // @ts-ignore
  configRepo.get = () => ({ id: 'test_app' });
  metric.init();
  const mtm: any[] = (globalThis as any)._mtm;
  expect(Array.isArray(mtm)).toBe(true);

  const evt = new CustomEvent(METRICS_EVENT, { detail: { name: 'test_event' } });
  globalThis.dispatchEvent(evt);

  expect(mtm.some((e) => e.event === 'test_event')).toBe(true);
});
