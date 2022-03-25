import { createSetAtom } from '~utils/atoms/createPrimitives';

export const enabledLayersAtom = createSetAtom(
  new Set<string>(),
  'enabledLayers',
);
