import { Plus24 } from '@konturio/default-icons';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import {
  currentMapAtom,
  currentMapPositionAtom,
  sideControlsBarAtom,
} from '~core/shared_state';
import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import app_config from '~core/app_config';
import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { AppFeature } from '~core/auth/types';
import { askGeoJSONFile } from './askGeoJSONFile';
import {
  GEOMETRY_UPLOADER_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_NAME,
} from './constants';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

function initFileUploader(reportReady: () => void) {
  sideControlsBarAtom.addControl.dispatch({
    id: GEOMETRY_UPLOADER_CONTROL_ID,
    name: GEOMETRY_UPLOADER_CONTROL_NAME,
    title: i18n.t('Focus to uploaded geometry'),
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
        if (!map) return;

        const geometryCamera = getCameraForGeometry(geoJSON, map);
        if (!geometryCamera || typeof geometryCamera === 'string') {
          currentNotificationAtom.showNotification.dispatch(
            'warning',
            { title: i18n.t('Not a valid geojson file') },
            6,
          );
          throw new Error('Not geoJSON format');
        }

        focusedGeometryAtom.setFocusedGeometry.dispatch(
          { type: 'uploaded' },
          geoJSON,
        );

        const { zoom, center } = geometryCamera;
        currentMapPositionAtom.setCurrentMapPosition.dispatch({
          zoom: Math.min(zoom, app_config.autoFocus.maxZoom),
          ...center,
        });
      });
    },
  });

  reportReady();
}

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.GEOMETRY_UPLOADER,
  initFunction(reportReady) {
    initFileUploader(reportReady);
  },
};
