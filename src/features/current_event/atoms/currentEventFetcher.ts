import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/api_client';
import { currentEventAtom } from '~core/shared_state';
import { autoRefreshService } from '~core/auto_refresh';

export const currentEventResource = createResourceAtom(
  currentEventAtom,
  (event) => (event?.id ? apiClient.get(`/events/${event.id}`) : null),
);

autoRefreshService.addWatcher('currentEvent', currentEventResource);
