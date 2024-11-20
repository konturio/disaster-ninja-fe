import { createAtom } from '~utils/atoms';
import { getCameraForBbox } from '~utils/map/camera';
import { currentMapAtom } from './currentMap';
import type { Map } from 'maplibre-gl';

export type CenterZoomPosition = {
  lat: number;
  lng: number;
  zoom: number;
};
export type Bbox = [number, number, number, number];
export type BboxPosition = {
  bbox: Bbox;
};

export type MapPosition = CenterZoomPosition | BboxPosition;

export type CurrentMapPositionAtomState = MapPosition | null;

// TODO: #20160 update currentMapPositionAtom to reatom v3
export const currentMapPositionAtom = createAtom(
  {
    setCurrentMapPosition: (mapPosition: CenterZoomPosition) => mapPosition,
    setCurrentMapBbox: (mapBbox: Bbox | [[number, number], [number, number]]) => mapBbox,
    updateCurrentMapPosition: (mapPosition: CenterZoomPosition) => mapPosition,
    currentMapAtom,
  },
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    function jumpTo(map: Map, position: CenterZoomPosition) {
      const { lng, lat, zoom } = position;
      requestAnimationFrame(() => {
        map.stop();
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
    }

    onAction('setCurrentMapPosition', (position) => {
      const map = currentMapAtom.getState();
      if (map) {
        jumpTo(map, position);
      }
      state = position;
    });

    onAction('setCurrentMapBbox', (bbox) => {
      let position = { bbox: bbox.flat() } as MapPosition;
      const map = currentMapAtom.getState();
      if (map) {
        const viewport = getCameraForBbox(bbox, map);
        if (viewport.center && 'lng' in viewport.center) {
          const { zoom } = viewport;
          const { lat, lng } = viewport.center;
          position = { ...position, lat, lng, zoom: zoom ?? map.getZoom() };
          jumpTo(map, position);
        }
      }
      state = position;
    });

    onAction('updateCurrentMapPosition', (position) => {
      state = position;
    });

    return state;
  },
  '[Shared state] currentMapPositionAtom',
);
