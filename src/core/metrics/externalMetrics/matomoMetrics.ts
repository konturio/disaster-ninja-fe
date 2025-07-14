import { METRICS_EVENT } from '~core/metrics/constants';
import { configRepo } from '~core/config';
import type { Metric, MetricsEvent } from '../types';

export class MatomoMetrics implements Metric {
  private ready = false;

  init() {
    // inject Matomo Tag Manager script dynamically
    const _mtm = (globalThis._mtm = globalThis._mtm || []);
    _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
    const d = globalThis.document;
    if (d) {
      const g = d.createElement('script');
      g.async = true;
      g.src = 'https://matomo.kontur.io/js/container_R9VsLLth.js';
      const s = d.getElementsByTagName('script')[0];
      s?.parentNode?.insertBefore(g, s);
    }
    this.subscribeMetricsEvents();
    this.ready = true;
  }

  mark(name: string, payload: unknown) {
    /* Noop */
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
    if (!this.ready) return;
    globalThis._mtm.push({ event: name, app_id: configRepo.get().id });
  }
}
