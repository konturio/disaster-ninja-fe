import { currentNotificationAtom, sideControlsBarAtom } from '~core/shared_state';
import {
  DRAW_TOOLS_CONTROL_ID,
  DRAW_TOOLS_CONTROL_NAME,
  drawModes,
  DOWNLOAD_GEOMETRY_CONTROL_ID,
  DOWNLOAD_GEOMETRY_CONTROL_NAME,
} from '~features/draw_tools/constants';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import { DrawToolsIcon } from '@k2-packages/default-icons';
import { drawLayerAtom } from './atoms/drawLayerAtom';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import { drawingIsStartedAtom } from '~features/draw_tools/atoms/drawingIsStartedAtom';
import DownloadIcon from './icons/DownloadIcon';
import { drawnGeometryAtom } from './atoms/drawnGeometryAtom';
import { TranslationService as i18n } from '~core/localization';



export function initDrawTools() {
  drawLayerAtom.mount.dispatch();
  sideControlsBarAtom.addControl.dispatch({
    id: DRAW_TOOLS_CONTROL_ID,
    name: DRAW_TOOLS_CONTROL_NAME,
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalitics,
    icon: <DrawToolsIcon />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(DRAW_TOOLS_CONTROL_ID);
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        drawingIsStartedAtom.setIsStarted.dispatch(false);
        // TODO fix that logic in layer.setMode()
        activeDrawModeAtom.setDrawMode.dispatch(drawModes.ModifyMode);
        activeDrawModeAtom.setDrawMode.dispatch(drawModes.DrawPolygonMode);
      } else {
        activeDrawModeAtom.setDrawMode.dispatch(null);
      }
    },
  });

  sideControlsBarAtom.addControl.dispatch({
    id: DOWNLOAD_GEOMETRY_CONTROL_ID,
    name: DOWNLOAD_GEOMETRY_CONTROL_NAME,
    active: false,
    visualGroup: controlVisualGroup.noAnalitics,
    icon: <DownloadIcon />,
    onClick: () => {
      const data = drawnGeometryAtom.getState()
      if (!data.features.length) return currentNotificationAtom.showNotification.dispatch(
        'info',
        { title: i18n.t('No drawn geometry to download') }, 5
      );
      // clear features from service properties
      const cleared = {
        type: 'FeatureCollection', features: data.features.map(feature => {
          feature.properties = {}
          return feature
        })
      }
      const file = new Blob([JSON.stringify(cleared)], { type: 'json' })
      const a = document.createElement("a")
      const url = URL.createObjectURL(file)
      a.href = url;
      a.download = `Disater_Ninja_custom_geometry_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  });
}
