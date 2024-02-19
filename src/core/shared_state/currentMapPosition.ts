import { createAtom } from '~utils/atoms';
import { getCameraForBbox } from '~utils/map/camera';
import { currentMapAtom } from './currentMap';

type CenterZoomPosition = {
  // type: 'centerZoom';
  lat: number;
  lng: number;
  zoom: number;
};
export type Bbox = [number, number, number, number];
type BboxPosition = {
  // type: 'bbox';
  bbox: Bbox;
};

type MapPosition = CenterZoomPosition | BboxPosition;

type CurrentMapPositionAtomState = MapPosition | null;

export const currentMapPositionAtom = createAtom(
  {
    setCurrentMapPosition: (mapPosition: { lat: number; lng: number; zoom: number }) =>
      mapPosition,
    setCurrentMapBbox: (mapBbox: Bbox | [[number, number], [number, number]]) => mapBbox,
  },
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    onAction('setCurrentMapPosition', (position) => {
      if (state === null || !('lng' in state)) {
        state = position;
      } else {
        const { lat, lng, zoom } = position;
        if (
          'lng' in state &&
          (state.lat !== lat || state.lng !== lng || state.zoom !== zoom)
        ) {
          state = position;
        }
      }
    });

    onAction('setCurrentMapBbox', (bbox) => {
      const position = { bbox: bbox.flat() as Bbox };
      const prev = state;
      if (prev === null || !('bbox' in prev)) {
        state = position;
      } else {
        if (
          'bbox' in prev &&
          prev?.bbox?.some((coord: number, i: number) => coord !== position.bbox[i])
        ) {
          state = position;
        }
      }
      const map = currentMapAtom.getState();
      if (!map) return;
      const cam = getCameraForBbox(bbox, map);
      if (cam.center && 'lng' in cam.center) {
        const { zoom } = cam;
        const { lat, lng } = cam.center;
        if (
          prev == null ||
          ('lng' in prev && (prev.lat !== lat || prev.lng !== lng || prev.zoom !== zoom))
        ) {
          state = { ...position, lat, lng, zoom };
        }
      }
    });

    return state;
  },
  '[Shared state] currentMapPositionAtom',
);
