import { METRICS_EVENT } from './constants';
import type { MetricsEventDetail } from './types';

export function dispatchMetricsEvent(name: string, payload: unknown) {
  const evt = new CustomEvent<MetricsEventDetail>(METRICS_EVENT, {
    detail: {
      name,
      payload,
    },
  });
  globalThis.dispatchEvent(evt);
}
