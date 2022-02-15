import { LogicalLayerAtom } from '~core/types/layers';
import { createMapAtom } from '~utils/atoms';

export const currentMountedLayersAtom = createMapAtom<string, LogicalLayerAtom>(
  new Map(),
  '[Shared state] currentMountedLayersAtom',
);
