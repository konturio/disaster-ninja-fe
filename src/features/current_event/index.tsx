import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';
import { currentEventGeometryAtom } from './atoms/currentEventGeometry';
import { currentEventRefresherAtom } from './atoms/currentEventRefresher';
import { currentEventAutoFocusAtom } from './atoms/currentEventAutoFocus';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.CURRENT_EVENT,
  initFunction(reportReady) {
    currentEventGeometryAtom.subscribe((val) => null);
    currentEventRefresherAtom.subscribe(() => null);
    currentEventAutoFocusAtom.subscribe(() => null);
    reportReady();
  },
};
