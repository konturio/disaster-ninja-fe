import { createMapAtom } from '~utils/atoms/createPrimitives';
import type { AsyncState } from '../types/asyncState';
import type { LayerMeta } from '../types/meta';

export const layersMetaAtom = createMapAtom(
  new Map<string, AsyncState<LayerMeta>>(),
  'layersMeta',
);
