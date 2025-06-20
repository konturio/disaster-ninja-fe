import { action, atom } from '@reatom/framework';
import { throttle } from '@github/mini-throttle';
import { getCameraForBbox, getCameraForGeometry } from '~utils/map/camera';
import { configRepo } from '~core/config';
import { currentMapAtom } from './currentMap';
import type { Map } from 'maplibre-gl';
import type { FeatureCollection } from '~utils/geoJSON/helpers';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';

export type CenterZoomPosition = {
  lat: number;
  lng: number;
  zoom: number;
};
export type Bbox =
  | [number, number, number, number]
  | [[number, number], [number, number]];
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

export const setCurrentMapBbox = action((ctx, bbox: Bbox) => {
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
}, 'setCurrentMapBbox');

export const focusOnGeometry = action(
  (ctx, geometry: FeatureCollection | Feature<Geometry, GeoJsonProperties>) => {
    const map = ctx.get(currentMapAtom.v3atom);
    if (!map) return;

    const geometryCamera = getCameraForGeometry(geometry, map);
    if (
      typeof geometryCamera?.zoom === 'number' &&
      geometryCamera.center &&
      'lat' in geometryCamera.center &&
      'lng' in geometryCamera.center
    ) {
      const position: CenterZoomPosition = {
        zoom: Math.min(geometryCamera.zoom, configRepo.get().autofocusZoom),
        ...geometryCamera.center,
      };
      setCurrentMapPosition(ctx, position);
    }
  },
  'focusOnGeometry',
);

// Auto-track position when map becomes available
let positionTrackingCleanup: (() => void) | null = null;

currentMapAtom.v3atom.onChange((ctx, map) => {
  // Clean up previous tracking if exists
  if (positionTrackingCleanup) {
    positionTrackingCleanup();
    positionTrackingCleanup = null;
  }

  if (map) {
    // Set up position tracking
    const throttledHandler = throttle(() => {
      const center = map.getCenter();
      currentMapPositionAtom(ctx, {
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
    }, 100);

    const onMoveEnd = () => {
      throttledHandler();
    };

    map.on('moveend', onMoveEnd);

    positionTrackingCleanup = () => {
      map.off('moveend', onMoveEnd);
    };
  }
});
