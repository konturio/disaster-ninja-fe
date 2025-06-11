import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { drawModes } from '~core/draw_tools/constants';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { createAtom } from '~utils/atoms/createPrimitives';
import { customLayerDrawToolsControl } from '~features/create_layer/drawToolsControl';
import { drawTools } from '~core/draw_tools';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { EditTargets } from '../constants';
import { editTargetAtom } from './editTarget';
import { currentEditedLayerFeatures } from './currentEditedLayerFeatures';

/* Enable / Disable draw tools panel */
export const openDrawToolsInFeatureEditMode = createAtom(
  {
    editTargetAtom,
  },
  ({ onChange, getUnlistedState, schedule }) => {
    onChange('editTargetAtom', (next) => {
      const { layerId } = next;
      const drawToolsActivated = !!getUnlistedState(activeDrawModeAtom);

      if (next.type === EditTargets.features && layerId !== undefined) {
        if (!drawToolsActivated) {
          schedule(async (dispatch, ctx = {}) => {
            ctx.unsubscribe = currentEditedLayerFeatures.subscribe(() => null);
            // TODO fix that logic in layer.setMode() in #9782
            dispatch([
              drawModeLogicalLayerAtom.enable(),
              toolboxAtom.setSettings({
                availableModes: ['DrawPolygonMode', 'DrawLineMode', 'DrawPointMode'],
              }),
              activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
              currentEditedLayerFeatures.readFeaturesFromLayer(layerId),
              customLayerDrawToolsControl.setState('active'),
            ]);

            // draw tools are not using the empty collection provided as the parameter.
            // They'll use features which are set inside currentEditedLayerFeatures.readFeaturesFromLayer(layerId)
            // TODO: This is BAD, needs refactoring
            const result = await drawTools.edit(new FeatureCollection([]));
            const features = result?.features;

            // This needed when saving features with save button in draw tools controls
            dispatch([currentEditedLayerFeatures.saveFeatures(features)]);
          });
        } else {
          notificationServiceInstance.info(
            {
              title: `You are already editing a layer`,
            },
            3,
          );
        }
      }

      if (drawToolsActivated && next.type === EditTargets.none) {
        schedule((dispatch, ctx = {}) => {
          if (typeof ctx.unsubscribe === 'function') {
            ctx.unsubscribe();
          }

          // TODO fix that logic in layer.setMode() in #9782
          dispatch([
            drawModeLogicalLayerAtom.disable(),
            activeDrawModeAtom.setDrawMode(null),
            drawnGeometryAtom.setFeatures([]),
            currentEditedLayerFeatures.reset(),
          ]);
        });
      }
    });
  },
);
