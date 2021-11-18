import { createBindAtom } from '~utils/atoms/createBindAtom';
import { currentEventAtom } from '~core/shared_state';
import { autoRefreshService } from '~core/auto_refresh';
import { currentEventResourceAtom } from './currentEventResource';

export const currentEventRefresherAtom = createBindAtom(
  {
    currentEventAtom,
  },
  ({ onChange, schedule }) => {
    onChange('currentEventAtom', (event, prev) => {
      if (event === null) {
        schedule((dispatch) => {
          autoRefreshService.removeWatcher('currentEvent');
        });
      } else if (prev === null || prev === undefined) {
        schedule((dispatch) => {
          autoRefreshService.addWatcher(
            'currentEvent',
            currentEventResourceAtom,
          );
        });
      }
    });
  },
);
