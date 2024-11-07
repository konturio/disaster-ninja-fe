import { createAtom } from '~utils/atoms';
import { getCameraForBbox } from '~utils/map/camera';
import { currentMapAtom } from './currentMap';
import type { Map } from 'maplibre-gl';

export type CenterZoomPosition = {
  // type: 'centerZoom';
  lat: number;
  lng: number;
  zoom?: number;
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
      state = position;
    }

    function jumpTo(map: Map, position: MapPosition) {
      const { lng, lat, zoom } = position as CenterZoomPosition;
      requestAnimationFrame(() => {
        map?.stop();
      });
      setTimeout(() => {
        const mapCenter = map.getCenter();
        const mapZoom = map.getZoom();
        if (mapCenter.lng !== lng || mapCenter.lat !== lat || mapZoom !== zoom) {
          requestAnimationFrame(() => {
            map?.jumpTo({
              center: [lng, lat],
              zoom: zoom,
            });
          });
        }
      }, 100);

      updateState(position);
    }

    onAction('setCurrentMapPosition', (position) => {
      const map = currentMapAtom.getState();
      if (!map) return;

      jumpTo(map, position);
    });

    onAction('setCurrentMapBbox', (bbox) => {
      const bboxPosition = { bbox: bbox.flat() as Bbox };
      const map = currentMapAtom.getState();
      if (!map) return;

      const cam = getCameraForBbox(bbox, map);
      if (cam.center && 'lng' in cam.center) {
        const { zoom } = cam;
        const { lat, lng } = cam.center;
        jumpTo(map, { ...bboxPosition, lat, lng, zoom });
      }
    });

    onAction('updateCurrentPosition', (position) => {
      updateState(position);
    });

    return state;
  },
  '[Shared state] currentMapPositionAtom',
);
