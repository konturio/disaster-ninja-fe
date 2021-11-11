import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { currentEventAtom } from '~core/shared_state';
import { autoRefreshService } from '~core/auto_refresh';
import { EventWithGeometry } from '~appModule/types';

export const currentEventResourceAtom = createResourceAtom(
  currentEventAtom,
  async (event) => {
    if (event?.id) {
      const responseData = await apiClient.get<EventWithGeometry>(
        `/events/${event.id}`,
        undefined,
        false,
      );
      if (responseData === undefined) throw 'No data received';
      return responseData;
    }
    return null;
  },
  'currentEventResource',
);

autoRefreshService.addWatcher('currentEvent', currentEventResourceAtom);
