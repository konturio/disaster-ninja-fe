import { createMapAtom } from '~utils/atoms/createPrimitives';
import { LayerAtom } from '../types/logicalLayer';

export const mountedLayersAtom = createMapAtom(
  new Map<string, LayerAtom>(),
  'mountedLayers',
);
