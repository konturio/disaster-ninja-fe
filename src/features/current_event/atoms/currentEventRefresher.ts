import { atom } from '@reatom/framework';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';

export const currentEventRefresherAtom = atom((ctx) => {
  // Subscribe to currentEventAtom changes
  ctx.spy(currentEventAtom.v3atom, (event) => {
    if (event?.id) {
      autoRefreshService.addWatcher('currentEvent', currentEventResourceAtom);
    } else {
      autoRefreshService.removeWatcher('currentEvent');
    }
  });
}, 'currentEventRefresherAtom');
