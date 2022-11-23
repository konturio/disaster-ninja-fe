import { createSetAtom } from '~core/store/atoms/createPrimitives';

export const hiddenLayersAtom = createSetAtom(
  new Set<string>(),
  'hiddenLayers',
);
