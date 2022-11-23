import { createMapAtom } from '~core/store/atoms/createPrimitives';
import type { AsyncState } from '../types/asyncState';
import type { LayerSource } from '../types/source';

export const layersSourcesAtom = createMapAtom(
  new Map<string, AsyncState<LayerSource>>(),
  'layersSources',
);
