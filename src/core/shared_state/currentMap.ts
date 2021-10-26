import { createAtom } from '@reatom/core';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

/**
 * Atom to save current map ref and reuse it in other atoms
 */
export const currentMapAtom = createAtom(
  {
    setMap: (map?: ApplicationMap) => map,
  },
  ({ onAction }, state: ApplicationMap | undefined = undefined) => {
    onAction('setMap', (map?: ApplicationMap) => {
      state = map;
    });
    return state;
  },
);
