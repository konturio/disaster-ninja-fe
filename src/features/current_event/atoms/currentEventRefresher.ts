import { atom } from '@reatom/framework';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';

export const currentEventRefresherAtom = atom((ctx) => {
  // Subscribe to currentEventAtom changes
  ctx.spy(currentEventAtom.v3atom, (event) => {
    if (event?.id) {
      autoRefreshService.addWatcher('currentEvent', currentEventResourceAtom);
      ctx.schedule(() =>
        enabledLayersAtom.set(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID).v3action(ctx),
      );
    } else {
      autoRefreshService.removeWatcher('currentEvent');
    }
  });
}, 'currentEventRefresherAtom');
