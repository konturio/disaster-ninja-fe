import { createAtom } from '~utils/atoms';
import { currentEventAtom } from '~core/shared_state';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { currentEventResourceAtom } from './currentEventResource';

export const currentEventRefresherAtom = createAtom(
  {
    currentEventAtom,
  },
  ({ onChange, schedule }) => {
    onChange('currentEventAtom', (event, prev) => {
      if (event === null || event.id === null) {
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
