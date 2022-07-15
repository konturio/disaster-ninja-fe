import { createAtom } from '~utils/atoms';
import { currentMapPositionAtom } from '~core/shared_state';
import { currentMapAtom } from '~core/shared_state';
import app_config from '~core/app_config';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import { currentEventGeometryAtom } from './currentEventGeometry';

export const currentEventAutoFocusAtom = createAtom(
  {
    currentEventGeometryAtom,
    map: currentMapAtom,
  },
  ({ onChange, get, schedule }) => {
    onChange(
      'currentEventGeometryAtom',
      (currentEventGeometry, lastEventGeometry) => {
        if (currentEventGeometry === null) return;
        if (scheduledAutoFocus === false) return;
        if (currentEventGeometry?.eventId !== lastEventGeometry?.eventId) {
          const map = get('map');
          const geometryCamera = getCameraForGeometry(
            currentEventGeometry.geojson,
            map,
          );
          if (!geometryCamera || typeof geometryCamera === 'string') return;
          const { zoom, center } = geometryCamera;
          schedule((dispatch) => {
            dispatch([
              scheduledAutoFocus.setFalse(),
              currentMapPositionAtom.setCurrentMapPosition({
                zoom: Math.min(zoom, app_config.autoFocus.maxZoom),
                ...center,
              }),
            ]);
          });
        }
      },
    );
  },
  '[Shared state] currentEventAtom',
);
