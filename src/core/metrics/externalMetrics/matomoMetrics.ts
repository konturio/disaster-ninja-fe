import { METRICS_EVENT } from '~core/metrics/constants';
import { configRepo } from '~core/config';
import type { Metric, MetricsEvent } from '../types';

export class MatomoMetrics implements Metric {
  private ready = false;

  init() {
    if (this.ready) return;
    const w = globalThis as any;
    w._mtm = w._mtm || [];
    w._mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = 'https://matomo.kontur.io/js/container_R9VsLLth.js';
    s.parentNode?.insertBefore(g, s);
    this.subscribeMetricsEvents();
    this.ready = true;
  }

  mark(name: string, payload: unknown) {
    /* noop */
  }

  subscribeMetricsEvents() {
    globalThis.addEventListener(
      METRICS_EVENT,
      this.metricsListener.bind(this) as EventListener,
    );
  }

  metricsListener(e: MetricsEvent) {
    const { name } = e.detail;
    this.dispatchEvent(name);
  }

  dispatchEvent(name: string) {
    const w = globalThis as any;
    w._mtm = w._mtm || [];
    w._mtm.push({ event: name, app_id: configRepo.get().id });
  }
}
