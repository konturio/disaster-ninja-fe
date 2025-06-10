import { createAtom } from '~utils/atoms/createPrimitives';

export const clickCoordinatesAtom = createAtom(
  {
    set: (coords: { lng: number; lat: number }) => coords,
  },
  ({ onAction }, state: null | { lat: number; lng: number } = null) => {
    onAction('set', (coords) => {
      state = coords;
    });

    return state;
  },
  'clickCoordinatesAtom',
);
