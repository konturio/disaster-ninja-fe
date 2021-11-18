import { currentEventGeometryAtom } from './atoms/currentEventGeometry';
import { currentEventRefresherAtom } from './atoms/currentEventRefresher';
import { currentEventAutoFocusAtom } from './atoms/currentEventAutoFocus';

export function initCurrentEvent() {
  currentEventGeometryAtom.subscribe((val) => null);
  currentEventRefresherAtom.subscribe(() => null);
  currentEventAutoFocusAtom.subscribe(() => null);
}
