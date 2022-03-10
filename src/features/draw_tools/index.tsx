import {
  currentNotificationAtom,
  sideControlsBarAtom,
} from '~core/shared_state';
import {
  DRAW_TOOLS_CONTROL_ID,
  DRAW_TOOLS_CONTROL_NAME,
  drawModes,
  DOWNLOAD_GEOMETRY_CONTROL_ID,
  DOWNLOAD_GEOMETRY_CONTROL_NAME,
} from '~features/draw_tools/constants';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import { DrawToolsIcon } from '@k2-packages/default-icons';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import DownloadIcon from './icons/DownloadIcon';
import { drawnGeometryAtom } from './atoms/drawnGeometryAtom';
import { TranslationService as i18n } from '~core/localization';
import { downloadObject } from '~utils/fileHelpers/download';
import { drawModeLogicalLayerAtom } from './atoms/logicalLayerAtom';
import { combinedAtom } from './atoms/combinedAtom';
import { drawModeRenderer } from './atoms/logicalLayerAtom';
// a little scratch about new and previous structure https://www.figma.com/file/G8VQQ3mctz5gPkcZZvbzCl/Untitled?node-id=0%3A1

export function initDrawTools() {
  drawModeRenderer.setupExtension(combinedAtom);

  sideControlsBarAtom.addControl.dispatch({
    id: DRAW_TOOLS_CONTROL_ID,
    name: DRAW_TOOLS_CONTROL_NAME,
    title: i18n.t('Focus to freehand geometry'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalitics,
    icon: <DrawToolsIcon />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(DRAW_TOOLS_CONTROL_ID);
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
    visualGroup: controlVisualGroup.noAnalitics,
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
          feature.properties = {};
          return feature;
        }),
      };
      downloadObject(
        cleared,
        `Disater_Ninja_custom_geometry_${new Date().toISOString()}.json`,
      );
    },
  });
}
