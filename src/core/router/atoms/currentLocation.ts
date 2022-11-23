import { createAtom } from '~core/store/atoms';
import type { History, Location } from 'history';

export const createCurrentLocationAtom = (history: History) => createAtom(
  {
    _set: (location: Location) => location,
  },
  ({ onAction, onInit, schedule, create }, state = history.location) => {
    onInit(() => {
      schedule((dispatch) => {
        history.listen((location) => {
          dispatch(create('_set', location));
        });
      });
    });

    onAction('_set', (location) => (state = location));
    return state;
  },
  'currentLocationAtom',
);

export type CurrentLocationAtom = ReturnType<typeof createCurrentLocationAtom>;