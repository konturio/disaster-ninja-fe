import { AppFeature } from '~core/auth/types';
import { forceRun } from '~utils/atoms/forceRun';
import { currentEventGeometryAtom } from './atoms/currentEventGeometry';
import { currentEventRefresherAtom } from './atoms/currentEventRefresher';
import { currentEventAutoFocusAtom } from './atoms/currentEventAutoFocus';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.CURRENT_EVENT,
  initFunction(reportReady) {
    initCurrentEvent(reportReady);
  },
  RootComponent() {
    return null;
  },
};
export function initCurrentEvent(reportReady) {
  forceRun([
    currentEventGeometryAtom,
    currentEventRefresherAtom,
    currentEventAutoFocusAtom,
  ]);
  reportReady();
}
