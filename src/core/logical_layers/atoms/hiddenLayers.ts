import { createSetAtom } from '~utils/atoms/createPrimitives';

export const hiddenLayersAtom = createSetAtom(new Set<string>(), 'hiddenLayers');
