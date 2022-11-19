import { Locate24 } from '@konturio/default-icons';
import {
  currentMapPositionAtom,
  currentNotificationAtom,
  toolbarControlsAtom,
} from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import core from '~core/index';
import {
  LOCATE_ME_CONTROL_ID,
  LOCATE_ME_CONTROL_NAME,
  LOCATE_ME_ZOOM,
} from './constants';

function successCb(location: GeolocationPosition) {
  const { coords } = location;
  const { latitude: lat, longitude: lng } = coords;

  currentMapPositionAtom.setCurrentMapPosition.dispatch({
    lat,
    lng,
    zoom: LOCATE_ME_ZOOM,
  });
  disableControl();
}

function errorCb(error: GeolocationPositionError) {
  currentNotificationAtom.showNotification.dispatch(
    'warning',
    { title: error.message || core.i18n.t('locate_me.get_location_error') },
    3,
  );
  disableControl();
}

export function initLocateMe() {
  toolbarControlsAtom.addControl.dispatch({
    id: LOCATE_ME_CONTROL_ID,
    name: LOCATE_ME_CONTROL_NAME,
    title: core.i18n.t('locate_me.feature_title'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    exclusiveGroup: controlGroup.mapTools,
    icon: <Locate24 />,
    onClick: () => {
      toolbarControlsAtom.enable.dispatch(LOCATE_ME_CONTROL_ID);
      const geolocation = navigator.geolocation;
      // Location dialogue should appear for the user
      geolocation.getCurrentPosition(successCb, errorCb);
    },
  });
}

function disableControl() {
  setTimeout(() => {
    toolbarControlsAtom.disable.dispatch(LOCATE_ME_CONTROL_ID);
  }, 3000);
}
