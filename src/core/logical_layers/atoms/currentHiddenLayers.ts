import { LogicalLayerAtom } from '~core/types/layers';
import { createMapAtom } from '~utils/atoms/createBindAtom';

export const currentHiddenLayersAtom = createMapAtom<string, LogicalLayerAtom>(
  new Map(),
  '[Shared state] currentHiddenLayersAtom',
);
