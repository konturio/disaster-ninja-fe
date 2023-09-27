import { createAtom } from '~utils/atoms';
import { currentMapPositionAtom } from '~core/shared_state';
import { currentMapAtom } from '~core/shared_state';
import { configRepo } from '~core/config';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import { currentEventGeometryAtom } from './currentEventGeometry';

export const currentEventAutoFocusAtom = createAtom(
  {
    currentEventGeometryAtom,
    map: currentMapAtom,
  },
  ({ onChange, get, schedule, getUnlistedState }) => {
    onChange('currentEventGeometryAtom', (currentEventGeometry, lastEventGeometry) => {
      if (currentEventGeometry === null) return;
      const autoFocusWasScheduled = getUnlistedState(scheduledAutoFocus);
      if (autoFocusWasScheduled === false) return;
      if (currentEventGeometry?.eventId !== lastEventGeometry?.eventId) {
        const map = get('map');
        const geometryCamera = getCameraForGeometry(currentEventGeometry.geojson, map);
        if (
          typeof geometryCamera === 'object' &&
          typeof geometryCamera.zoom === 'number' &&
          geometryCamera.center &&
          'lat' in geometryCamera.center &&
          'lng' in geometryCamera.center
        ) {
          const maxZoom = configRepo.get().autofocusZoom;
          const pos = {
            zoom: Math.min(geometryCamera.zoom || maxZoom, maxZoom),
            ...geometryCamera.center,
          };
          schedule((dispatch) => {
            dispatch([
              scheduledAutoFocus.setFalse(),
              currentMapPositionAtom.setCurrentMapPosition(pos),
            ]);
          });
        }
      }
    });
  },
  'currentEventAutoFocusAtom',
);
