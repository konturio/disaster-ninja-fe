import { createAtom } from '~utils/atoms';

export type MapPosition =
  | {
      lat: number;
      lng: number;
      zoom: number;
    }
  | { bbox: [[number, number], [number, number]] };

type CurrentMapPositionAtomState = MapPosition | null;

export const currentMapPositionAtom = createAtom(
  {
    setCurrentMapPosition: (mapPosition: MapPosition) => mapPosition,
  },
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    onAction('setCurrentMapPosition', (position) => {
      if ('bbox' in position) {
        if (
          state === null ||
          !('bbox' in state) ||
          state.bbox.some((coord, i) => coord !== position.bbox[i])
        ) {
          state = { bbox: position.bbox };
        }
      } else {
        const { lat, lng, zoom } = position;
        if (state === null) state = { lat, lng, zoom };
        if (
          ('lat' in state && state.lat !== lat) ||
          ('lng' in state && state.lng !== lng) ||
          ('zoom' in state && state.zoom !== zoom)
        ) {
          state = { lat, lng, zoom };
        }
      }
    });

    return state;
  },
  '[Shared state] currentMapPositionAtom',
);
