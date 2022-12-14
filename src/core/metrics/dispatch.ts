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

const dispatched = {};
export const dispatchMetricsEventOnce = (name: string, payload: unknown) => {
  if (dispatched[name]) return;
  dispatched[name] = true;
  dispatchMetricsEvent(name, payload);
};
