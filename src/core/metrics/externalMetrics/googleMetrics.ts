import { GA4_EVENTS } from '~core/metrics/externalMetrics/googleEventsList';
import { METRICS_EVENT } from '~core/metrics/constants';
import { configRepo } from '~core/config';
import type { Metric, MetricsEvent } from '../types';

const googleEventsCollection = new Set(GA4_EVENTS);

export class GoogleMetrics implements Metric {
  private ready = false;
  private tagManager;

  init() {
    import('react-gtm-module').then((module) => {
      const { default: TagManager } = module;
      this.tagManager = TagManager;
      this.tagManager.initialize({ gtmId: 'GTM-5LD2Z3D' });
      this.subscribeMetricsEvents();
      this.checkIfRegistrationRedirectUrl() && this.dispatchEvent('verified_email');
      this.ready = true;
    });
  }

  mark(name: string, payload: unknown) {
    /* Noop */
  }

  subscribeMetricsEvents() {
    globalThis.addEventListener(
      METRICS_EVENT,
      this.metricsListener.bind(this) as EventListener,
    );
  }

  metricsListener(e: MetricsEvent) {
    const { name, payload } = e.detail;
    if (googleEventsCollection.has(name)) {
      this.dispatchEvent(name);
    }
  }

  dispatchEvent(name) {
    this.tagManager.dataLayer({
      dataLayer: { event: name, app_id: configRepo.get().id },
    });
  }

  /**  We agreed to assume that the presence of the 'iss' URL parameter indicates a redirect from email verification. */
  checkIfRegistrationRedirectUrl() {
    const params = new URLSearchParams(globalThis.location.search);
    return !!params.get('iss');
  }
}
