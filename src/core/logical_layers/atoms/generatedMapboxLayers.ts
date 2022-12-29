import { createMapAtom } from '~utils/atoms/createPrimitives';

type MapboxLayerId = string;
type BackendLayerId = string;

export const generatedMapboxLayersParents = createMapAtom(
  new Map<MapboxLayerId, BackendLayerId>(),
  'generatedMapboxLayersParents',
);
