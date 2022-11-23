import { createMapAtom } from '~core/store/atoms/createPrimitives';
import type { AsyncState } from '../types/asyncState';
import type { LayerLegend } from '../types/legends';

export const layersLegendsAtom = createMapAtom(
  new Map<string, AsyncState<LayerLegend>>(),
  'layersLegends',
);
