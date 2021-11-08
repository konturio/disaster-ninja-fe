import { createBindAtom } from '~utils/atoms/createBindAtom';

export interface MapPosition {
  lat: number;
  lng: number;
  zoom: number;
}

type CurrentMapPositionAtomState = MapPosition | null;

export const currentMapPositionAtom = createBindAtom(
  {
    setCurrentMapPosition: (mapPosition: MapPosition) => mapPosition,
  },
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    onAction('setCurrentMapPosition', ({ lat, lng, zoom }) => {
      if (state === null) state = { lat, lng, zoom };
      if (state.lat !== lat || state.lng !== lng || state.zoom !== zoom) {
        state = { lat, lng, zoom };
      }
    });
    return state;
  },
  'currentMapPositionAtom',
);
