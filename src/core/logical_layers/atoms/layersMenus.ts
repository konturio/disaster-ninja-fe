import { createMapAtom } from '~utils/atoms/createPrimitives';
import type { LayerContextMenu } from '../types/contextMenu';

export const layersMenusAtom = createMapAtom(
  new Map<string, LayerContextMenu>(),
  'layersMenus',
);
