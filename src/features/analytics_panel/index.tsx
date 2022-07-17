import { AppFeature } from '~core/auth/types';
import { AnalyticsPanel } from './components/AnalyticsPanel/AnalyticsPanel';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.ANALYTICS_PANEL,
  rootComponentWrap(reportReady, addedProps) {
    return () => <AnalyticsPanel reportReady={reportReady} />;
  },
};
