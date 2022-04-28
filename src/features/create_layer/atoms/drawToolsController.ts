import { TranslationService as i18n } from '~core/localization';
import { store } from '~core/store/store';
import { sideControlsBarAtom } from '~core/shared_state';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { drawModes } from '~core/draw_tools/constants';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { createAtom } from '~utils/atoms/createPrimitives';
import { CREATE_LAYER_CONTROL_ID, EditTargets } from '../constants';
import { currentEditedLayerFeatures } from './currentEditedLayerFeatures';
import { editTargetAtom } from './editTarget';

/* When saving success - close darwtools panel and edit feature form */
function onFinishDrawing() {
  return new Promise<boolean>((res, rej) => {
    currentEditedLayerFeatures.save.dispatch({
      onSuccess: () => {
        store.dispatch([
          sideControlsBarAtom.disable(CREATE_LAYER_CONTROL_ID),
          editTargetAtom.set({ type: EditTargets.none }),
        ]);
        res(true);
      },
      onError: rej,
    });
  });
}

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
          schedule((dispatch, ctx = {}) => {
            ctx.unsubscribe = currentEditedLayerFeatures.subscribe(() => null);
            // TODO fix that logic in layer.setMode() in #9782
            dispatch([
              drawModeLogicalLayerAtom.enable(),
              toolboxAtom.setSettings({
                availableModes: ['DrawPointMode', 'ModifyMode'],
                finishButtonText: i18n.t('Save features'),
                finishButtonCallback: onFinishDrawing,
              }),
              activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
              currentEditedLayerFeatures.readFeaturesFromLayer(layerId),
            ]);
          });
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
