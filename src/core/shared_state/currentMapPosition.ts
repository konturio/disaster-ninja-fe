import { createAtom } from '@reatom/core';

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
  ({ onAction }, state: CurrentMapPositionAtomState = null) => {
    onAction('setCurrentMapPosition', (mapPosition) => (state = mapPosition));
    return state;
  },
);
