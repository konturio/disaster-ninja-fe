import { METRICS_EVENT } from '~core/metrics/constants';
import { configRepo } from '~core/config';
import type { Metric, MetricsEvent } from '../types';

export class MatomoMetrics implements Metric {
  private ready = false;
  private appId = '';

  init(appId: string, _route: string) {
    this.appId = appId;
    const d = globalThis.document;
    if (d) {
      try {
        const _mtm = (globalThis._mtm = globalThis._mtm || []);
        _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
        const g = d.createElement('script');
        g.async = true;
        g.src = configRepo.get().matomoContainerUrl ?? '';
        g.addEventListener('load', () => {
          this.ready = true;
        });
        g.addEventListener('error', (err) => {
          console.error('Matomo script failed to load', err);
        });
        const s = d.getElementsByTagName('script')[0];
        if (s?.parentNode) {
          s.parentNode.insertBefore(g, s);
        } else {
          d.head.appendChild(g);
        }
      } catch (e) {
        console.error('Failed to inject Matomo script', e);
      }
    }
    this.subscribeMetricsEvents();
  }

  mark(name: string, payload: unknown) {
    /* noop */
  }

  private subscribeMetricsEvents() {
    globalThis.addEventListener(
      METRICS_EVENT,
      this.metricsListener.bind(this) as EventListener,
    );
  }

  private metricsListener(e: MetricsEvent) {
    const { name } = e.detail;
    this.dispatchEvent(name);
  }

  private dispatchEvent(name: string) {
    if (!this.ready || typeof globalThis._mtm?.push !== 'function') return;
    globalThis._mtm.push({ event: name, app_id: this.appId });
  }
}
