import { mapStyleAtom } from './atoms/mapStyle';

export function initInteractiveMap() {
  // 1. Listen map listeners and call map api
  // 2. Listen map markers and call map api
  mapStyleAtom.subscribe((style) => {
    /* call map api */
  });
}
