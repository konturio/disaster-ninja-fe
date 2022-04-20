import { createAtom } from '~utils/atoms/createPrimitives';
import { editTargetAtom } from './editTarget';
import { EditTargets } from '../constants';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { drawModes } from '~core/draw_tools/constants';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { currentEditedLayerFeatures } from './currentEditedLayerFeatures';
import { TranslationService as i18n } from '~core/localization';

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
                finishButtonCallback: () =>
                  new Promise((res, rej) => {
                    currentEditedLayerFeatures.save.dispatch({
                      onSuccess: () => res(true),
                      onError: rej,
                    });
                  }),
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
