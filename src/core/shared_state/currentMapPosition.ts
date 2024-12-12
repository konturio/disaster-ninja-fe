import { action, atom } from '@reatom/framework';
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

export const currentMapPositionAtom = atom<CurrentMapPositionAtomState>(
  null,
  '[Shared state] currentMapPositionAtom',
);

export const setCurrentMapPosition = action((ctx, position: CenterZoomPosition) => {
  const map = currentMapAtom.getState();
  if (map) {
    jumpTo(map, position);
  }
  currentMapPositionAtom(ctx, position);
}, 'setCurrentMapPosition');

export const setCurrentMapBbox = action(
  (ctx, bbox: Bbox | [[number, number], [number, number]]) => {
    let position = { bbox: bbox.flat() } as MapPosition;
    const map = currentMapAtom.getState();
    if (map) {
      const camera = getCameraForBbox(bbox, map);
      if (camera.center && 'lng' in camera.center) {
        const { zoom } = camera;
        const { lat, lng } = camera.center;
        position = { ...position, lat, lng, zoom: zoom ?? map.getZoom() };
        jumpTo(map, position);
      }
    }
    currentMapPositionAtom(ctx, position);
  },
  'setCurrentMapBbox',
);
