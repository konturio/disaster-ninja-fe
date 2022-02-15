import { createMapAtom } from '~utils/atoms';
import { LayerLegend } from '../createLogicalLayerAtom';

export const currentLegendsAtom = createMapAtom<string, LayerLegend>(
  new Map(),
  '[Shared state] currentLegends',
);
