import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { currentEventFeedAtom } from '~core/shared_state';
import type { Event } from '~core/types';

export const eventListResourceAtom = createResourceAtom(
  async (currentFeed) => {
    const params =
      currentFeed && currentFeed.id ? { feed: currentFeed.id } : undefined;
    const responseData = await apiClient.get<Event[]>(`/events/`, params, true);
    if (responseData === undefined) throw new Error('No data received');
    return responseData;
  },
  currentEventFeedAtom,
  'eventListResource',
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
