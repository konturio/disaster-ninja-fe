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
import { DrawToolsIcon } from '@k2-packages/default-icons';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import { TranslationService as i18n } from '~core/localization';
import { downloadObject } from '~utils/fileHelpers/download';
import DownloadIcon from '~core/draw_tools/icons/DownloadIcon';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';

export function initFreehandGeometry() {
  sideControlsBarAtom.addControl.dispatch({
    id: FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
    name: FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME,
    title: i18n.t('Focus to freehand geometry'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalytics,
    icon: <DrawToolsIcon />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(
        FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
      );
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        // TODO fix that logic in layer.setMode()
        drawModeLogicalLayerAtom.enable.dispatch();
        activeDrawModeAtom.setDrawMode.dispatch(drawModes.ModifyMode);
        activeDrawModeAtom.setDrawMode.dispatch(drawModes.DrawPolygonMode);
      } else {
        drawModeLogicalLayerAtom.disable.dispatch();
        activeDrawModeAtom.setDrawMode.dispatch(null);
      }
    },
  });

  sideControlsBarAtom.addControl.dispatch({
    id: DOWNLOAD_GEOMETRY_CONTROL_ID,
    name: DOWNLOAD_GEOMETRY_CONTROL_NAME,
    title: i18n.t('Download selected area'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <DownloadIcon />,
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
}
