import { AppFeature } from '~core/auth/types';
import { BivariatePanel } from './BivariatePanel/BivariatePanel';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.BIVARIATE_MANAGER,
  rootComponentWrap:
    (reportReady: () => void, props: Record<string, unknown>) => () => {
      return <BivariatePanel reportReady={reportReady} {...props} />;
    },
};
