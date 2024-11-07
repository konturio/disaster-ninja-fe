import { createAtom } from '~utils/atoms';
import { getCameraForBbox } from '~utils/map/camera';
import { currentMapAtom } from './currentMap';

export type CenterZoomPosition = {
  // type: 'centerZoom';
  lat: number;
  lng: number;
  zoom: number;
};
export type Bbox = [number, number, number, number];
export type BboxPosition = {
  // type: 'bbox';
  bbox: Bbox;
};

export type MapPosition = CenterZoomPosition | BboxPosition;

export type CurrentMapPositionAtomState = MapPosition | null;

export const currentMapPositionAtom = createAtom(
  {
    setCurrentMapPosition: (mapPosition: { lat: number; lng: number; zoom: number }) =>
      mapPosition,
    setCurrentMapBbox: (mapBbox: Bbox | [[number, number], [number, number]]) => mapBbox,
    updateCurrentPosition: (mapPosition: { lat: number; lng: number; zoom: number }) =>
      mapPosition,
    currentMapAtom,
  },
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    function updateState(position: MapPosition) {
      // TODO: check if old === new
      // console.log('updateCurrentPosition', { ...state }, '=>', position);
      state = position;
    }

    onAction('setCurrentMapPosition', (position) => {
      // console.log('setCurrentMapPosition', position);
      const map = currentMapAtom.getState();
      // TODO: check if old === new
      /*
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
      */

      map?.stop();
      map?.jumpTo({
        center: [position.lng, position.lat],
        zoom: position.zoom,
      });
      updateState(position);
    });

    onAction('setCurrentMapBbox', (bbox) => {
      // console.log('setCurrentMapBbox', bbox);
      const position = { bbox: bbox.flat() as Bbox };
      const prev = state;
      // TODO: check if old === new
      /*
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
        */
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
          //state = { ...position, lat, lng, zoom };
          map?.stop();
          map?.jumpTo({
            center: [lng, lat],
            zoom,
          });
          updateState({ ...position, lat, lng, zoom });
        }
      }
    });

    onAction('updateCurrentPosition', (position) => {
      updateState(position);
    });

    return state;
  },
  '[Shared state] currentMapPositionAtom',
);
