import turfBbox from '@turf/bbox';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { currentMapPositionAtom } from '~core/shared_state';
import { currentMapAtom } from '~core/shared_state';
import { currentEventGeometryAtom } from './currentEventGeometry';
import app_config from '~core/app_config';

export const currentEventAutoFocusAtom = createBindAtom(
  {
    currentEventGeometryAtom,
    map: currentMapAtom,
  },
  ({ onChange, get, schedule }) => {
    onChange(
      'currentEventGeometryAtom',
      (currentEventGeometry, lastEventGeometry) => {
        if (currentEventGeometry === null) return;
        if (currentEventGeometry?.eventId !== lastEventGeometry?.eventId) {
          const map = get('map');
          if (!map) return;
          // Turf can return 3d bbox, so we need to cut off potential extra data
          const bbox = turfBbox(currentEventGeometry.geojson) as [
            number,
            number,
            number,
            number,
          ];
          bbox.length = 4;
          const camera = map.cameraForBounds(bbox, {
            padding: app_config.autoFocus.desktopPaddings,
          });
          if (!camera) return;
          const { zoom, center } = camera;
          schedule((dispatch) => {
            dispatch(
              currentMapPositionAtom.setCurrentMapPosition({
                zoom: Math.min(zoom, app_config.autoFocus.maxZoom),
                ...center,
              }),
            );
          });
        }
      },
    );
  },
  '[Shared state] currentEventAtom',
);
