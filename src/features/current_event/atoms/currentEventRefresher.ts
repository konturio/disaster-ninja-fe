import { createAtom } from '~utils/atoms';
import { currentEventAtom } from '~core/shared_state';
import core from '~core/index';
import { currentEventResourceAtom } from './currentEventResource';

export const currentEventRefresherAtom = createAtom(
  {
    currentEventAtom,
  },
  ({ onChange, schedule }) => {
    onChange('currentEventAtom', (event, prev) => {
      if (event === null || event.id === null) {
        schedule((dispatch) => {
          core.autoRefresh.removeWatcher('currentEvent');
        });
      } else if (prev === null || prev === undefined) {
        schedule((dispatch) => {
          core.autoRefresh.addWatcher('currentEvent', currentEventResourceAtom);
        });
      }
    });
  },
);
