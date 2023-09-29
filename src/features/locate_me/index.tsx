import { currentMapPositionAtom, currentNotificationAtom } from '~core/shared_state';
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import {
  LOCATE_ME_CONTROL_ID,
  LOCATE_ME_CONTROL_NAME,
  LOCATE_ME_ZOOM,
} from './constants';

export const locateMeControl = toolbar.setupControl({
  id: LOCATE_ME_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: LOCATE_ME_CONTROL_NAME,
    hint: i18n.t('locate_me.feature_title'),
    icon: 'Locate24',
    preferredSize: 'small',
  },
});

locateMeControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    const geolocation = navigator.geolocation;
    // Location dialogue should appear for the user
    geolocation.getCurrentPosition(successCb, errorCb);
  }
});

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
    { title: error.message || i18n.t('locate_me.get_location_error') },
    3,
  );
  disableControl();
}

function disableControl() {
  store.dispatch(locateMeControl.setState('regular'));
}

export function initLocateMe() {
  locateMeControl.init();
}
