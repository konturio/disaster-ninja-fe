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
    setFocusedIndexes: (indexes: number[]) => indexes
  },
  ({ onChange, schedule, onAction }, state: boolean = false) => {
    onChange('activeDrawModeAtom', (mode) => {
      if (!mode) return schedule(dispatch => dispatch(drawLayerAtom.hide()))

      drawModeLayer.setMode(mode)
    });

    onChange('drawnGeometryAtom', data => {
      drawModeLayer.updateData(data)
    })

    onAction('setFocusedIndexes', indexes => {
      // drawModeLayer.updateSelection(indexes)
    })

    return state;
  },
);
