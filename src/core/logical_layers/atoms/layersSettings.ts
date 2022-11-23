import { createMapAtom } from '~core/store/atoms/createPrimitives';
import type { AsyncState } from '../types/asyncState';
import type { LayerSettings } from '../types/settings';

export const layersSettingsAtom = createMapAtom(
  new Map<string, AsyncState<LayerSettings>>(),
  'layersSettings',
);
