import { AppFeature } from '~core/auth/types';
import { AdvancedAnalyticsPanel } from './components/AdvancedAnalyticsPanel/AdvancedAnalyticsPanel';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.ADVANCED_ANALYTICS_PANEL,
  rootComponentWrap(reportReady, addedProps) {
    return () => <AdvancedAnalyticsPanel reportReady={reportReady} />;
  },
};
