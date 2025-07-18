import { METRICS_EVENT } from '~core/metrics/constants';
import { configRepo } from '~core/config';
import type { AppFeatureType } from '~core/app/types';
import type { Metric, MetricsEvent } from '../types';

export class MatomoMetrics implements Metric {
  private ready = false;
  private listener?: EventListener;
  private scriptUrl = '';

  init(_appId: string, _route: string, _hasFeature?: (f: AppFeatureType) => boolean) {
    if (this.ready) return;
    const w = globalThis as any;
    w._mtm = w._mtm || [];
    w._mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.async = true;
    try {
      this.scriptUrl = configRepo.get().matomoContainerUrl;
      g.src = this.scriptUrl;
      g.addEventListener('error', (err) => {
        console.error('Matomo script failed to load', err);
      });
      s.parentNode?.insertBefore(g, s);
    } catch (e) {
      console.error('Matomo script injection error', e);
    }
    this.subscribeMetricsEvents();
    this.ready = true;
  }

  mark(name: string, payload: unknown) {
    /* noop */
  }

  subscribeMetricsEvents() {
    this.listener = this.metricsListener.bind(this) as EventListener;
    globalThis.addEventListener(METRICS_EVENT, this.listener);
  }

  cleanup() {
    if (this.listener) {
      globalThis.removeEventListener(METRICS_EVENT, this.listener);
      this.listener = undefined;
    }
  }

  metricsListener(e: MetricsEvent) {
    const { name } = e.detail;
    this.dispatchEvent(name);
  }

  dispatchEvent(name: string) {
    try {
      const w = globalThis as any;
      w._mtm = w._mtm || [];
      w._mtm.push({ event: name, app_id: configRepo.get().id });
    } catch (e) {
      console.error('Matomo dispatch failed', e);
    }
  }
}
