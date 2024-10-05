import { createAtom } from '~utils/atoms';

export const currentLocationAtom = createAtom(
  {
    set: (location: CurrentLocation) => location,
  },
  ({ onAction }, state: CurrentLocation = globalThis.location) => {
    onAction('set', (location) => (state = location));
    return state;
  },
  'currentLocationAtom',
);

interface CurrentLocation {
  pathname: string;
}
