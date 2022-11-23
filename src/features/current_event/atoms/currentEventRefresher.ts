import { createAtom } from '~core/store/atoms';
import core from '~core/index';
import { currentEventResourceAtom } from './currentEventResource';

export const currentEventRefresherAtom = createAtom(
  {
    currentEventAtom: core.sharedState.currentEventAtom,
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
