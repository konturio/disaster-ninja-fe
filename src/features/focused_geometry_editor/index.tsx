import {
  currentNotificationAtom,
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
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { forceRun } from '~utils/atoms/forceRun';
import { focusedGeometryEditorAtom } from './atoms/focusedGeometryEditorAtom';
import { isEditorActiveAtom } from './atoms/isEditorActive';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';

export function initFocusedGeometry() {
  forceRun(focusedGeometryEditorAtom);

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
        isEditorActiveAtom.set.dispatch(true);

        toolboxAtom.setAvalibleModes.dispatch([
          'DrawPolygonMode',
          'DrawLineMode',
          'DrawPointMode',
        ]);
        // TODO fix that logic in layer.setMode()
        drawModeLogicalLayerAtom.enable.dispatch();
        activeDrawModeAtom.setDrawMode.dispatch(drawModes.ModifyMode);
        activeDrawModeAtom.setDrawMode.dispatch(drawModes.DrawPolygonMode);
      } else {
        isEditorActiveAtom.set.dispatch(false);
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
      const data = drawnGeometryAtom.getState();
      if (!data.features.length)
        return currentNotificationAtom.showNotification.dispatch(
          'info',
          { title: i18n.t('No drawn geometry to download') },
          5,
        );
      // clear features from service properties
      const cleared = {
        type: 'FeatureCollection',
        features: data.features.map((feature) => {
          return { ...feature, properties: {} };
        }),
      };
      downloadObject(
        cleared,
        `Disaster_Ninja_custom_geometry_${new Date().toISOString()}.json`,
      );
    },
  });
}
