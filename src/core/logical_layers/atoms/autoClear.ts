import { createAtom } from '~core/store/atoms';
import { currentMapAtom } from '../../map/atoms/currentMap';
import { hiddenLayersAtom } from './hiddenLayers';
import { mountedLayersAtom } from './mountedLayers';

export const autoClearAtom = createAtom(
  {
    currentMapAtom,
  },
  ({ onChange, schedule }) => {
    onChange('currentMapAtom', (currentMap, prevMap) => {
      if (!prevMap) return;
      schedule((dispatch) => {
        dispatch([hiddenLayersAtom.clear(), mountedLayersAtom.clear()]);
      });
    });
  },
);
