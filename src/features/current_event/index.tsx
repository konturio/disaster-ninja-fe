import { forceRun } from '~utils/atoms/forceRun';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { autoFocusToGeometry } from './atoms/currentEventAutoFocus';
import { currentEventGeometryAtom } from './atoms/currentEventGeometry';
import { currentEventRefresherAtom } from './atoms/currentEventRefresher';

export async function initCurrentEvent() {
  autoFocusToGeometry(currentEventGeometryAtom);
  forceRun([currentEventGeometryAtom, v3toV2(currentEventRefresherAtom)]);
}
