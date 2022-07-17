import { AppFeature } from '~core/auth/types';
import { forceRun } from '~utils/atoms/forceRun';
import { currentEventGeometryAtom } from './atoms/currentEventGeometry';
import { currentEventRefresherAtom } from './atoms/currentEventRefresher';
import { currentEventAutoFocusAtom } from './atoms/currentEventAutoFocus';
import type { InitFeatureInterface } from '~utils/metrics/initFeature';

/* eslint-disable react/display-name */
export const featureInterface: InitFeatureInterface = {
  affectsMap: false,
  id: AppFeature.CURRENT_EVENT,
  initFunction(reportReady) {
    initCurrentEvent(reportReady);
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
