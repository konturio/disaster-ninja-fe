import { AppFeature } from '~core/auth/types';
import { BivariatePanel } from './BivariatePanel/BivariatePanel';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.BIVARIATE_MANAGER,
  RootComponent: BivariatePanel,
};
