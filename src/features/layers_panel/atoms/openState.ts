import { createMapAtom } from '~utils/atoms/createPrimitives';

// Map of tree element id to open state
export const layersTreeOpenStateAtom = createMapAtom<string, boolean>(
  new Map(),
  'layersTreeOpenStateAtom',
);
