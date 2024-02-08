import { forceRun } from '~utils/atoms/forceRun';
import { currentEventGeometryAtom } from './atoms/currentEventGeometry';
import { currentEventRefresherAtom } from './atoms/currentEventRefresher';
import { autoFocusToGeometry } from './atoms/currentEventAutoFocus';

export async function initCurrentEvent() {
  autoFocusToGeometry(currentEventGeometryAtom);
  forceRun([currentEventGeometryAtom, currentEventRefresherAtom]);
}
