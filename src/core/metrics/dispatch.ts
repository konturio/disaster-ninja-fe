import type { MetricsEventDetail } from './types';

export const METRICS_EVENT = 'METRICS';

export function dispatchMetricsEvent(name: string, payload: unknown) {
  const evt = new CustomEvent<MetricsEventDetail>(METRICS_EVENT, {
    detail: {
      name,
      payload,
    },
  });
  globalThis.dispatchEvent(evt);
}
