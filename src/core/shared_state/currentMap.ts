import { createAtom } from '~utils/atoms';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';

/**
 * Atom to save current map ref and reuse it in other atoms
 */
export const currentMapAtom = createAtom(
  {
    setMap: (map?: ApplicationMap) => map,
  },
  ({ onAction, schedule }, state: ApplicationMap | undefined = undefined) => {
    onAction('setMap', (map?: ApplicationMap) => {
      state = map;

      // dismount all layers on map change
      schedule((dispatch) => {
        dispatch(mountedLayersAtom.clear());
      });
    });
    return state;
  },
  '[Shared state] currentMapAtom',
);
