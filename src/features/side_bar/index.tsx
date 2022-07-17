import { AppFeature } from '~core/auth/types';
import { SideBar } from './components/SideBar/SideBar';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.SIDE_BAR,
  rootComponentWrap(reportReady, addedProps) {
    return () => <SideBar reportReady={reportReady} />;
  },
};
