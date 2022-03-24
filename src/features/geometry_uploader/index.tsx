import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import {
  currentMapAtom,
  currentMapPositionAtom,
  sideControlsBarAtom,
} from '~core/shared_state';
import { askGeoJSONFile } from './askGeoJSONFile';
import { UploadFileIcon } from '@k2-packages/default-icons';
import {
  GEOMETRY_UPLOADER_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_NAME,
} from './constants';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import turfBbox from '@turf/bbox';
import app_config from '~core/app_config';
import { TranslationService as i18n } from '~core/localization';

export function initFileUploader() {
  sideControlsBarAtom.addControl.dispatch({
    id: GEOMETRY_UPLOADER_CONTROL_ID,
    name: GEOMETRY_UPLOADER_CONTROL_NAME,
    title: i18n.t('Focus to uploaded geometry'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalytics,
    icon: <UploadFileIcon />,
    onClick: () => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      askGeoJSONFile((geoJSON) => {
        focusedGeometryAtom.setFocusedGeometry.dispatch(
          { type: 'uploaded' },
          geoJSON,
        );
        const map = currentMapAtom.getState();
        if (!map) return;

        // Turf can return 3d bbox, so we need to cut off potential extra data
        const bbox = turfBbox(geoJSON) as [number, number, number, number];
        bbox.length = 4;
        const camera = map.cameraForBounds(bbox, {
          padding: app_config.autoFocus.desktopPaddings,
        });
        if (!camera) return;
        const { zoom, center } = camera;
        currentMapPositionAtom.setCurrentMapPosition.dispatch({
          zoom: Math.min(zoom, app_config.autoFocus.maxZoom),
          ...center,
        });
      });
    },
  });
}
