import { createMapAtom } from '~utils/atoms/createPrimitives';
import type { AsyncState } from '../types/asyncState';
import type { LayerEditor } from '../types/editors';

export const layersEditorsAtom = createMapAtom(
  new Map<string, AsyncState<LayerEditor>>(),
  'layersLegends',
);
