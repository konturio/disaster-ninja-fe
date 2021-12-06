import { activeDrawModeAtom } from './activeDrawMode';
import { createLogicalLayerAtom } from '~utils/atoms';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DRAW_TOOLS_LAYER_ID } from '../constants';
import { DrawModeLayer } from '../layers/DrawModeLayer';
import { LogicalLayerAtom } from '~utils/atoms/createLogicalLayerAtom';
import { drawnGeometryAtom } from './drawnGeometryAtom';

// should we unmount prev layers after mode changes? should we delete or clear them?

const drawModeLayer = new DrawModeLayer(DRAW_TOOLS_LAYER_ID)

export const drawLayerAtom = createBindAtom(
  {
    activeDrawModeAtom,
  },
  ({ onChange, schedule, onInit }, state: LogicalLayerAtom | undefined = undefined) => {
    onInit(() => {

      console.log('%c⧭', 'color: #ffcc00', 'init did run');
      const layerAtom = createLogicalLayerAtom(drawModeLayer, drawnGeometryAtom);
      state = layerAtom;
      schedule((dispatch) => state && dispatch(state.mount()));
    })
    onChange('activeDrawModeAtom', (mode) => {
      if (!mode) {
        // todo first time we mount, then we only hide and show 'em
        schedule((dispatch) => state && dispatch(state.hide()));
      } else if (mode !== 'ViewMode'){

        schedule((dispatch) => {
          state && dispatch(state.unhide())
          drawModeLayer.addDeckLayer(mode)
        });
      }
    });

    return state;
  },
  'drawLayerAtom',
);
