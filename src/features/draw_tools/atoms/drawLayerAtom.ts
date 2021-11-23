import { activeDrawModeAtom } from './activeDrawMode';
import { createLogicalLayerAtom } from '~utils/atoms';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DRAW_TOOLS_LAYER_ID } from '../constants';
import { DrawModeLayer } from '../layers/DrawMode';
import { LogicalLayerAtom } from '~utils/atoms/createLogicalLayerAtom';

// should we unmount prev layers after mode changes? should we delete or clear them?

export const drawLayerAtom = createBindAtom(
  {
    activeDrawModeAtom,
  },
  ({ onChange, schedule }, state: LogicalLayerAtom | undefined = undefined) => {
    onChange('activeDrawModeAtom', (mode) => {
      if (mode && mode !== 'ViewMode') {
        const layerAtom = createLogicalLayerAtom(
          new DrawModeLayer(DRAW_TOOLS_LAYER_ID),
        );
        state = layerAtom;
        schedule((dispatch) => state && dispatch(state.mount()));
      } else {
        schedule((dispatch) => state && dispatch(state.unmount()));
      }
    });

    return state;
  },
  'drawLayerAtom',
);
