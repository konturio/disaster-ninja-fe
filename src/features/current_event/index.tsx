import { currentEventGeometry } from './atoms/currentEventGeometry';
import { currentEventRefresher } from './atoms/currentEventRefresher';

export function initCurrentEvent() {
  currentEventGeometry.subscribe((val) => null);
  currentEventRefresher.subscribe(() => null);
}
