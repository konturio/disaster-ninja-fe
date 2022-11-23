import { createAtom } from '~core/store/atoms';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

/**
 * Atom to save current map ref and reuse it in other atoms
 */
export const currentMapAtom = createAtom(
  {
    setMap: (map: ApplicationMap) => map,
    resetMap: () => null,
  },
  ({ onAction, schedule }, state: ApplicationMap | null = null) => {
    onAction('setMap', (map: ApplicationMap) => {
      state = map;

      // dismount all layers on map change
      schedule((dispatch) => {
        dispatch(mountedLayersAtom.clear());
      });
    });

    onAction('resetMap', () => {
      state = null;
    });

    return state;
  },
  '[Shared state] currentMapAtom',
);
