import { AppFeature } from '~core/auth/types';
import { AnalyticsPanel } from './components/AnalyticsPanel/AnalyticsPanel';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.ANALYTICS_PANEL,
  RootComponent: AnalyticsPanel,
};
