import { createMapAtom } from '~utils/atoms/createPrimitives';
import type { LayerAtom } from '../types/logicalLayer';

export const mountedLayersAtom = createMapAtom(
  new Map<string, LayerAtom>(),
  'mountedLayers',
);

/**
 * In rare cases atom can have wrong state (reatom bug)
 * But subscribe function still get correct update.
 * So, as very dirty temporary fix I store last update info for workaround
 */
export let _lastUpdatedState_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
  mountedLayersAtom.getState();
mountedLayersAtom.subscribe((s) => {
  _lastUpdatedState_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = s;
});
