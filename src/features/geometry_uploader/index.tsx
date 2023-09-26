import { Plus24 } from '@konturio/default-icons';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import {
  currentMapAtom,
  currentMapPositionAtom,
  toolbarControlsAtom,
} from '~core/shared_state';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import configRepo from '~core/config';
import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import {
  GEOMETRY_UPLOADER_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_NAME,
} from './constants';
import { askGeoJSONFile } from './askGeoJSONFile';

export function initFileUploader() {
  toolbarControlsAtom.addControl.dispatch({
    id: GEOMETRY_UPLOADER_CONTROL_ID,
    name: GEOMETRY_UPLOADER_CONTROL_NAME,
    title: i18n.t('geometry_uploader.title'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalytics,
    icon: <Plus24 />,
    onClick: () => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      askGeoJSONFile((geoJSON) => {
        const map = currentMapAtom.getState();
        if (!map || !geoJSON) return;

        toolbarControlsAtom.enable.dispatch(GEOMETRY_UPLOADER_CONTROL_ID);
        const geometryCamera = getCameraForGeometry(geoJSON, map);
        if (!geometryCamera || typeof geometryCamera === 'string') {
          currentNotificationAtom.showNotification.dispatch(
            'warning',
            { title: i18n.t('geometry_uploader.title') },
            6,
          );
          toolbarControlsAtom.disable.dispatch(GEOMETRY_UPLOADER_CONTROL_ID);
          throw new Error('Not geoJSON format');
        }

        focusedGeometryAtom.setFocusedGeometry.dispatch({ type: 'uploaded' }, geoJSON);

        const { zoom, center } = geometryCamera;
        const maxZoom = configRepo.get().autofocusZoom;
        // @ts-expect-error CenterZoomBearing issues
        currentMapPositionAtom.setCurrentMapPosition.dispatch({
          zoom: Math.min(zoom || maxZoom, maxZoom),
          ...center,
        });
        setTimeout(() => {
          toolbarControlsAtom.disable.dispatch(GEOMETRY_UPLOADER_CONTROL_ID);
        }, 300);
      });
    },
  });
}
