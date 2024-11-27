import { action, atom } from '@reatom/framework';
import { createAtom } from '~utils/atoms';
import { getCameraForBbox } from '~utils/map/camera';
import { store } from '~core/store/store';
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

// TODO: #20160 update currentMapPositionAtom to reatom v3
// TODO: need to get rid of v2 currentMapPositionAtom, but not sure yet how to make urlStore work with reatom v3
export const currentMapPositionAtom = createAtom(
  {
    setState: (position: CurrentMapPositionAtomState) => position,
    currentMapAtom,
  },
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    onAction('setState', (position) => {
      state = position;
    });

    return state;
  },
  '[Shared state] currentMapPositionAtom',
);

export const mapPositionAtom = atom<CurrentMapPositionAtomState>(null, 'mapPositionAtom');

export const setCurrentMapPosition = action((ctx, position: CenterZoomPosition) => {
  const map = currentMapAtom.getState();
  if (map) {
    jumpTo(map, position);
  }
  mapPositionAtom(ctx, position);
  // TODO: delete along with v2 atom
  store.dispatch(currentMapPositionAtom.setState(position));
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
    mapPositionAtom(ctx, position);
    // TODO: delete along with v2 atom
    store.dispatch(currentMapPositionAtom.setState(position));
  },
  'setCurrentMapBbox',
);

export const updateCurrentMapPosition = action((ctx, position: CenterZoomPosition) => {
  mapPositionAtom(ctx, position);
  // TODO: delete along with v2 atom
  store.dispatch(currentMapPositionAtom.setState(position));
}, 'updateCurrentMapPosition');
