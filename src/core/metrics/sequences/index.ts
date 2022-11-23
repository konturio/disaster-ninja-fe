import { eventReadyForScreenShot } from './eventReadyForScreenShot';
// import { allFeaturesReady } from './allFeaturesReady';
import type { AppMetrics } from '../AppMetrics';

export function addAllSequences(metrics: AppMetrics) {
  eventReadyForScreenShot(metrics);
  // allFeaturesReady(metrics)
}
