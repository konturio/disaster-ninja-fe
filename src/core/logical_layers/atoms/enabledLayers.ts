import { createSetAtom } from '@reatom/core/primitives';

export const enabledLayersAtom = createSetAtom(
  new Set<string>(),
  'enabledLayers',
);
