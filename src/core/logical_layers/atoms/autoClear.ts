import { createAtom } from '~utils/atoms';
import { currentMapAtom } from '../../shared_state/currentMap';
import { hiddenLayersAtom } from './hiddenLayers';
import { mountedLayersAtom } from './mountedLayers';

export const autoClearAtom = createAtom(
  {
    currentMapAtom,
  },
  ({ get, schedule }) => {
    const currentMap = get('currentMapAtom');
    if (currentMap === null) {
      schedule((dispatch) => {
        dispatch([hiddenLayersAtom.clear(), mountedLayersAtom.clear()]);
      });
    } else {
      schedule((dispatch) => {
        dispatch(mountedLayersAtom.clear());
      });
    }
  },
);
