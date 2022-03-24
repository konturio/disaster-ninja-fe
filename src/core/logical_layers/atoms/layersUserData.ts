import { createMapAtom } from '~utils/atoms/createPrimitives';
import type { AsyncState } from '../types/asyncState';
import { LayerUserData } from '~core/logical_layers/types/userData';

export const layersUserDataAtom = createMapAtom(
  new Map<string, AsyncState<LayerUserData>>(),
  'layersUserData',
);
