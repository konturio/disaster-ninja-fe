import { Poly24 } from '@konturio/default-icons';
import { Download24 } from '@konturio/default-icons';
import {
  currentNotificationAtom,
  focusedGeometryAtom,
  sideControlsBarAtom,
} from '~core/shared_state';
import {
  drawModes,
  DOWNLOAD_GEOMETRY_CONTROL_ID,
  DOWNLOAD_GEOMETRY_CONTROL_NAME,
  FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
  FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME,
} from '~core/draw_tools/constants';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import { i18n } from '~core/localization';
import { downloadObject } from '~utils/file/download';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { forceRun } from '~utils/atoms/forceRun';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { store } from '~core/store/store';
import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';
import { isEditorActiveAtom } from './atoms/isEditorActive';
import { focusedGeometryEditorAtom } from './atoms/focusedGeometryEditorAtom';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export function initFocusedGeometry(reportReady) {
  forceRun(focusedGeometryEditorAtom);

  sideControlsBarAtom.addControl.dispatch({
    id: FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
    name: FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME,
    title: i18n.t('Focus to freehand geometry'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalytics,
    icon: <Poly24 />,
    onClick: () => {
      sideControlsBarAtom.toggleActiveState.dispatch(
        FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
      );
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        store.dispatch([
          isEditorActiveAtom.set(true),
          toolboxAtom.setSettings({
            availableModes: [
              'DrawPolygonMode',
              'DrawLineMode',
              'DrawPointMode',
            ],
            finishButtonCallback: () =>
              new Promise((res) => {
                focusedGeometryEditorAtom.updateGeometry.dispatch();
                res(true);
              }),
          }),
          drawModeLogicalLayerAtom.enable(),
          activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
        ]);
        // TODO fix that logic in layer.setMode() in #9782
        store.dispatch(
          activeDrawModeAtom.setDrawMode(drawModes.DrawPolygonMode),
        );
      } else {
        store.dispatch([
          isEditorActiveAtom.set(false),
          drawModeLogicalLayerAtom.disable(),
          activeDrawModeAtom.setDrawMode(null),
        ]);
      }
    },
  });

  sideControlsBarAtom.addControl.dispatch({
    id: DOWNLOAD_GEOMETRY_CONTROL_ID,
    name: DOWNLOAD_GEOMETRY_CONTROL_NAME,
    title: i18n.t('Download selected area'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <Download24 />,
    onClick: () => {
      const data = focusedGeometryAtom.getState();
      if (!data)
        return currentNotificationAtom.showNotification.dispatch(
          'info',
          { title: i18n.t('No selected geometry to download') },
          5,
        );
      downloadObject(
        { ...data.geometry },
        `Disaster_Ninja_selected_geometry_${new Date().toISOString()}.json`,
      );
    },
  });

  reportReady();
}
export const featureInterface: FeatureInterface = {
  affectsMap: true,
  id: AppFeature.FOCUSED_GEOMETRY_EDITOR,
  initFunction(reportReady) {
    initFocusedGeometry(reportReady);
  },
};
