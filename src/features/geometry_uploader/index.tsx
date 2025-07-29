import { currentMapAtom } from '~core/shared_state';
import { toolbar } from '~core/toolbar';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { getCameraForGeometry } from '~utils/map/camera';
import { store } from '~core/store/store';
import { v3ActionToV2 } from '~utils/atoms/v3tov2';
import { setCurrentMapPosition } from '~core/shared_state/currentMapPosition';
import {
  GEOMETRY_UPLOADER_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_NAME,
} from './constants';
import { askGeoJSONFile } from './askGeoJSONFile';
import type { CenterZoomPosition } from '~core/shared_state/currentMapPosition';
import type { Action } from '@reatom/core-v2';

const uploadClickListener = (e) => {
  onClickCb();
};

const fileUploaderControl = toolbar.setupControl({
  id: GEOMETRY_UPLOADER_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: GEOMETRY_UPLOADER_CONTROL_NAME,
    hint: GEOMETRY_UPLOADER_CONTROL_NAME,
    icon: 'Upload24',
    preferredSize: 'large',
    onRef: (el) => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      el?.addEventListener('click', uploadClickListener);
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
      v3ActionToV2<CenterZoomPosition>(
        setCurrentMapPosition,
        // @ts-expect-error CenterZoomBearing issues
        {
          zoom: Math.min(zoom || maxZoom, maxZoom),
          ...center,
        },
        'setCurrentMapPosition',
      ),
    );

    store.dispatch(actions);
  });
}

export function initFileUploader() {
  fileUploaderControl.init();
}
