import { currentEventResourceAtom } from './atoms/currentEventResource';

export function initCurrentEvent() {
  currentEventResourceAtom.subscribe((val) => null);
}
