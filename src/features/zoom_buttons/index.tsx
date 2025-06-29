import { currentMapAtom } from '~core/shared_state';
import { setCurrentMapPosition } from '~core/shared_state/currentMapPosition';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import {
  ZOOM_IN_CONTROL_ID,
  ZOOM_OUT_CONTROL_ID,
  ZOOM_IN_CONTROL_NAME,
  ZOOM_OUT_CONTROL_NAME,
} from './constants';

function createZoomControl(id: string, name: string, icon: string, delta: number) {
  const control = toolbar.setupControl({
    id,
    type: 'button',
    typeSettings: {
      name,
      hint: name,
      icon,
      preferredSize: 'tiny',
    },
  });

  control.onStateChange((ctx, state) => {
    if (state === 'active') {
      const map = currentMapAtom.getState();
      if (map) {
        const zoom = map.getZoom() + delta;
        const center = map.getCenter();
        setCurrentMapPosition(store.v3ctx, {
          lat: center.lat,
          lng: center.lng,
          zoom,
        });
      }
      store.dispatch(control.setState('regular'));
    }
  });

  return control;
}

export const zoomInControl = createZoomControl(
  ZOOM_IN_CONTROL_ID,
  ZOOM_IN_CONTROL_NAME,
  'Plus16',
  1,
);

export const zoomOutControl = createZoomControl(
  ZOOM_OUT_CONTROL_ID,
  ZOOM_OUT_CONTROL_NAME,
  'Minus16',
  -1,
);

export function initZoomButtons() {
  zoomInControl.init();
  zoomOutControl.init();
}
