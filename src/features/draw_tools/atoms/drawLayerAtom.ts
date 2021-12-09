import { activeDrawModeAtom } from './activeDrawMode';
import { createLogicalLayerAtom } from '~utils/atoms';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DrawModeType, DRAW_TOOLS_LAYER_ID } from '../constants';
import { DrawModeLayer } from '../layers/DrawModeLayer';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { currentMapAtom, focusedGeometryAtom } from '~core/shared_state';


const drawModeLayer = new DrawModeLayer(DRAW_TOOLS_LAYER_ID)

export const drawLayerAtom = createLogicalLayerAtom(drawModeLayer, drawnGeometryAtom)

export const modeWatcherAtom = createBindAtom(
  {
    drawLayerAtom,
    activeDrawModeAtom,
    drawnGeometryAtom,
  },
  ({ onChange, schedule }, prevMode: DrawModeType | undefined = undefined) => {
    onChange('activeDrawModeAtom', (mode) => {
      schedule(dispatch => dispatch(currentMapAtom.setInteractivity(true)))
      if (!mode) {
        schedule(dispatch => dispatch(drawLayerAtom.hide()))
      }
      // Case we enabled draw mode - lets get features from focused geometry
      else if (!prevMode && mode) {
        const focusedFeatures = focusedGeometryAtom.getState()

        if (focusedFeatures) schedule(dispatch => {
          const actions: any[] = []
          if (focusedFeatures.geometry.type === 'FeatureCollection') actions.push(drawnGeometryAtom.updateFeatures(focusedFeatures.geometry.features))
          else if (focusedFeatures.geometry.type === 'Feature') actions.push(drawnGeometryAtom.addFeature(focusedFeatures.geometry))
          actions.push(focusedGeometryAtom.setFocusedGeometry({ type: 'custom' }, { type: 'FeatureCollection', features: [] }))
          dispatch(actions)
        })
      }
      if (mode) {
        if (!drawLayerAtom.getState().isMounted) return schedule(dispatch => dispatch(activeDrawModeAtom.setDrawMode(undefined)))
        drawModeLayer.setMode(mode)
      }

      prevMode = mode
    });

    onChange('drawnGeometryAtom', data => {
      drawModeLayer.updateData(data)
    })

    return prevMode
  },
);
