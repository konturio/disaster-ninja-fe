import { AppFeature } from '~core/auth/types';
import { AdvancedAnalyticsPanel } from './components/AdvancedAnalyticsPanel/AdvancedAnalyticsPanel';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.ADVANCED_ANALYTICS_PANEL,
  RootComponent: AdvancedAnalyticsPanel,
};
