import { activeDrawModeAtom } from './activeDrawMode';
import { createLogicalLayerAtom } from '~utils/atoms';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DRAW_TOOLS_LAYER_ID } from '../constants';
import { DrawModeLayer } from '../layers/DrawModeLayer';
import { drawnGeometryAtom } from './drawnGeometryAtom';


const drawModeLayer = new DrawModeLayer(DRAW_TOOLS_LAYER_ID)

export const drawLayerAtom = createLogicalLayerAtom(drawModeLayer, drawnGeometryAtom)

export const modeWatcherAtom = createBindAtom(
  {
    drawLayerAtom,
    activeDrawModeAtom,
    drawnGeometryAtom,    
  },
  ({ onChange, schedule }, state: boolean = false) => {
    onChange('activeDrawModeAtom', (mode) => {
      if (!mode) return schedule(dispatch => dispatch(drawLayerAtom.hide()))
      schedule(dispatch => dispatch(drawLayerAtom.unhide()))

      drawModeLayer.addDeckLayer(mode)
    });
    
    onChange('drawnGeometryAtom', data => {
      drawModeLayer.updateViewData(data)
    })

    return state;
  },
);
