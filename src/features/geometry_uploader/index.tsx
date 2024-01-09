import { currentMapAtom, currentMapPositionAtom } from '~core/shared_state';
import { toolbar } from '~core/toolbar';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { store } from '~core/store/store';
import {
  GEOMETRY_UPLOADER_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_NAME,
} from './constants';
import { askGeoJSONFile } from './askGeoJSONFile';
import type { Action } from '@reatom/core-v2';

const fileUploaderControl = toolbar.setupControl({
  id: GEOMETRY_UPLOADER_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: GEOMETRY_UPLOADER_CONTROL_NAME,
    hint: i18n.t('geometry_uploader.title'),
    icon: 'Upload24',
    preferredSize: 'large',
    onRef: (el) => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      el?.addEventListener('click', (e) => onClickCb());
    },
  },
});

fileUploaderControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(fileUploaderControl.setState('regular'));
  }
});

function onClickCb() {
  askGeoJSONFile((geoJSON) => {
    const map = currentMapAtom.getState();
    if (!map || !geoJSON) return;

    const actions: Action[] = [];
    const geometryCamera = getCameraForGeometry(geoJSON, map);
    if (!geometryCamera || typeof geometryCamera === 'string') {
      actions.push(
        currentNotificationAtom.showNotification(
          'warning',
          { title: i18n.t('geometry_uploader.title') },
          6,
        ),
      );
      store.dispatch(actions);
      throw new Error('Not geoJSON format');
    }

    actions.push(focusedGeometryAtom.setFocusedGeometry({ type: 'uploaded' }, geoJSON));

    const { zoom, center } = geometryCamera;
    const maxZoom = configRepo.get().autofocusZoom;
    actions.push(
      // @ts-expect-error CenterZoomBearing issues
      currentMapPositionAtom.setCurrentMapPosition({
        zoom: Math.min(zoom || maxZoom, maxZoom),
        ...center,
      }),
    );

    store.dispatch(actions);
  });
}

export function initFileUploader() {
  fileUploaderControl.init();
}
