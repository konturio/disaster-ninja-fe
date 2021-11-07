import { currentEventGeometry } from './atoms/currentEventGeometry';

export function initCurrentEvent() {
  currentEventGeometry.subscribe((val) => null);
}
