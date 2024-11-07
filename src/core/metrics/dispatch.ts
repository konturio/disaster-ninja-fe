import { METRICS_EVENT } from './constants';
import type { MetricsEventDetail } from './types';

export function dispatchMetricsEvent(name: string, payload?: unknown) {
  if (!globalThis.CustomEvent) return;
  const evt = new CustomEvent<MetricsEventDetail>(METRICS_EVENT, {
    detail: {
      name,
      payload,
    },
  });
  globalThis.dispatchEvent(evt);
}

const dispatched = new Set<string>();
export const dispatchMetricsEventOnce = (name: string, payload: unknown) => {
  if (dispatched.has(name)) return;
  dispatched.add(name);
  dispatchMetricsEvent(name, payload);
};
