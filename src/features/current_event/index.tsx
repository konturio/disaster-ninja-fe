import { forceRun } from '~utils/atoms/forceRun';
import { currentEventGeometryAtom } from './atoms/currentEventGeometry';
import { currentEventRefresherAtom } from './atoms/currentEventRefresher';
import { currentEventAutoFocusAtom } from './atoms/currentEventAutoFocus';

export function initCurrentEvent() {
  forceRun([
    currentEventGeometryAtom,
    currentEventRefresherAtom,
    currentEventAutoFocusAtom,
  ]);
}
