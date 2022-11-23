import { createAtom, createBooleanAtom } from '~core/store/atoms';

export interface MapPosition {
  lat: number;
  lng: number;
  zoom: number;
}

type CurrentMapPositionAtomState = MapPosition | null;

export const currentMapPositionAtom = createAtom(
  {
    setCurrentMapPosition: (mapPosition: MapPosition) => mapPosition,
  },
  ({ onAction, schedule }, state: CurrentMapPositionAtomState = null) => {
    const prevState = state;
    onAction('setCurrentMapPosition', ({ lat, lng, zoom }) => {
      if (state === null) state = { lat, lng, zoom };
      if (state.lat !== lat || state.lng !== lng || state.zoom !== zoom) {
        state = { lat, lng, zoom };
      }
    });

    if (state !== prevState) {
      schedule((dispatch) => dispatch(mapIdle.setFalse()));
    }
    return state;
  },
  '[Shared state] currentMapPositionAtom',
);

export const mapIdle = createBooleanAtom(false, 'mapIdle');
