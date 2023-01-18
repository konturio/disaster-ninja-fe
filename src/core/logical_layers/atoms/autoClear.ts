import { createAtom } from '~utils/atoms';
import { currentMapAtom } from '../../shared_state/currentMap';
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
  'autoClearAtom',
);
