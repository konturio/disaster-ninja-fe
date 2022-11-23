import { createAtom } from '~core/store/atoms';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import core from '~core/index';
import { currentEventGeometryAtom } from './currentEventGeometry';

export const currentEventAutoFocusAtom = createAtom(
  {
    currentEventGeometryAtom,
    map: core.sharedState.currentMapAtom,
  },
  ({ onChange, get, schedule, getUnlistedState }) => {
    onChange('currentEventGeometryAtom', (currentEventGeometry, lastEventGeometry) => {
      if (currentEventGeometry === null) return;
      const autoFocusWasScheduled = getUnlistedState(scheduledAutoFocus);
      if (autoFocusWasScheduled === false) return;
      if (currentEventGeometry?.eventId !== lastEventGeometry?.eventId) {
        const map = get('map');
        const geometryCamera = getCameraForGeometry(currentEventGeometry.geojson, map);
        if (!geometryCamera || typeof geometryCamera === 'string') return;
        const { zoom, center } = geometryCamera;
        schedule((dispatch) => {
          dispatch([
            scheduledAutoFocus.setFalse(),
            core.sharedState.currentMapPositionAtom.setCurrentMapPosition({
              zoom: Math.min(zoom, core.app.config.autoFocus.maxZoom),
              ...center,
            }),
          ]);
        });
      }
    });
  },
  '[Shared state] currentEventAtom',
);
