import { createSetAtom } from '~core/store/atoms/createPrimitives';

export const enabledLayersAtom = createSetAtom(
  new Set<string>(),
  'enabledLayers',
);
