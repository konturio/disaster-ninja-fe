import { activeDrawModeAtom } from './activeDrawMode';
import { createAtom } from '~utils/atoms';
import { DRAW_TOOLS_LAYER_ID, DrawModeType } from '../constants';
import { DrawModeLayer } from '../layers/DrawModeLayer';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { currentMapAtom } from '~core/shared_state';
import { createLogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { setMapInteractivity } from '~utils/map/setMapInteractivity';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';

const drawModeLayer = new DrawModeLayer(DRAW_TOOLS_LAYER_ID);

export const drawLayerAtom = createLogicalLayerAtom(
  drawModeLayer,
  drawnGeometryAtom,
);

export const modeWatcherAtom = createAtom(
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
      const drawLayerState = get('drawLayerAtom');

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
      // temporary geometry clears out after every deletion of any amount of features
      // if we cleared temporaryGeometry, there's no need to clear all displayed geometry (geometry from drawnGeometryAtom)
      if (data.features.length) drawModeLayer.updateData(data);
    });

    return prevMode;
  },
);
