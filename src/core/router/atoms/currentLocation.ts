import history from '~core/history';
import { createAtom } from '~utils/atoms';
import type { Location } from 'history';

export const currentLocationAtom = createAtom(
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
