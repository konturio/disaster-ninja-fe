import { createAtom } from '~utils/atoms';
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
      // dismount all layers on map change
      if (map !== state) {
        state = map;
        schedule((dispatch) => {
          dispatch(mountedLayersAtom.clear());
        });
      }
    });

    onAction('resetMap', () => {
      state = null;
      schedule((dispatch) => {
        dispatch(mountedLayersAtom.clear());
      });
    });

    return state;
  },
  '[Shared state] currentMapAtom',
);
