import { AppFeature } from '~core/auth/types';
import { featureStatus } from '~core/featureStatus';
import { mapStyleAtom } from './atoms/mapStyle';

export function initInteractiveMap() {
  // 1. Listen map listeners and call map api
  // 2. Listen map markers and call map api
  mapStyleAtom.subscribe((style) => {
    /* call map api */
  });

  featureStatus.markReady(AppFeature.INTERACTIVE_MAP);
}
