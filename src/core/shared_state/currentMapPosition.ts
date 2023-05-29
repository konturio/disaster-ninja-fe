import { createAtom } from '~utils/atoms';

type CenterZoomPosition = {
  type: 'centerZoom';
  lat: number;
  lng: number;
  zoom: number;
};
type Bbox = [[number, number], [number, number]];
type BboxPosition = {
  type: 'bbox';
  bbox: Bbox;
};

export type MapPosition = CenterZoomPosition | BboxPosition;

type CurrentMapPositionAtomState = MapPosition | null;

export const currentMapPositionAtom = createAtom(
  {
    setCurrentMapPosition: (mapPosition: { lat: number; lng: number; zoom: number }) => ({
      type: 'centerZoom' as const,
      ...mapPosition,
    }),
    setCurrentMapBbox: (mapBbox: Bbox) => ({
      type: 'bbox' as const,
      bbox: mapBbox,
    }),
  },
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    onAction('setCurrentMapPosition', (position) => {
      if (state === null || state.type !== 'centerZoom') {
        state = position;
      } else {
        const { lat, lng, zoom } = position;
        if (state.lat !== lat || state.lng !== lng || state.zoom !== zoom) {
          state = position;
        }
      }
    });

    onAction('setCurrentMapBbox', (position) => {
      if (state === null || state.type !== 'bbox') {
        state = position;
      } else {
        if (state.bbox.some((coord, i) => coord !== position.bbox[i])) {
          state = position;
        }
      }
    });

    return state;
  },
  '[Shared state] currentMapPositionAtom',
);
