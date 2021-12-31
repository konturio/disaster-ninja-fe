import { activeDrawModeAtom } from './activeDrawMode';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DRAW_TOOLS_LAYER_ID, DrawModeType } from '../constants';
import { DrawModeLayer } from '../layers/DrawModeLayer';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { currentMapAtom } from '~core/shared_state';
import { createLogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { setMapInteractivity } from '../setMapInteractivity';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';

const drawModeLayer = new DrawModeLayer(DRAW_TOOLS_LAYER_ID);

export const drawLayerAtom = createLogicalLayerAtom(
  drawModeLayer,
  drawnGeometryAtom,
);

export const modeWatcherAtom = createBindAtom(
  {
    drawLayerAtom,
    activeDrawModeAtom,
    drawnGeometryAtom,
    temporaryGeometryAtom,
    currentMapAtom,
  },
  ({ onChange, schedule, get }, prevMode: DrawModeType | null = null) => {
    onChange('activeDrawModeAtom', (mode) => {
      const map = get('currentMapAtom');
      const drawLayerState = get('drawLayerAtom')

      // turn on interactivity in case user swithced mode without finishing drawing
      if (map) setMapInteractivity(map, true);

      if (!mode) {
        schedule((dispatch) => dispatch(drawLayerAtom.hide()));
      } else {
        if (!prevMode) {
          drawModeLayer.addClickListener();
        }
        if (!drawLayerState.isMounted)
          return schedule((dispatch) =>
            dispatch(activeDrawModeAtom.setDrawMode(null)),
          );
        drawModeLayer.setMode(mode);
      }

      prevMode = mode;
    });

    onChange('drawnGeometryAtom', (data) => {
      drawModeLayer.updateData(data);
    });

    onChange('temporaryGeometryAtom', (data) => {
      drawModeLayer.updateData(data);
    });

    return prevMode;
  },
);
