import turfBbox from '@turf/bbox';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { currentMapPositionAtom } from '~core/shared_state';
import { currentMapAtom } from '~core/shared_state';
import { currentEventGeometryAtom } from './currentEventGeometry';

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
          // Turf can return 3d bbox, so wi need to cut off potential extra data
          const bbox = turfBbox(currentEventGeometry.geojson) as [
            number,
            number,
            number,
            number,
          ];
          bbox.length = 4;
          const desktopPaddings = {
            left: 336, // communities/analytics panel + paddings
            right: 300, // Layers list panel
            top: 16,
            bottom: 16,
          };
          const camera = map.cameraForBounds(bbox, {
            padding: desktopPaddings,
          });
          if (!camera) return;
          const { zoom, center } = camera;
          schedule((dispatch) => {
            dispatch(
              currentMapPositionAtom.setCurrentMapPosition({
                zoom: Math.min(zoom, 13),
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
