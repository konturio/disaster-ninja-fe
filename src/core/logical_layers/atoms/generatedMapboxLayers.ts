import { createMapAtom } from '~utils/atoms/createPrimitives';

type MaplibreLayerId = string;
type UiLayerId = string;

export const generatedMapboxLayersParents = createMapAtom(
  new Map<MaplibreLayerId, UiLayerId>(),
  'generatedMapboxLayersParents',
);
