import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { autoRefreshService } from '~core/auto_refresh';
import { Event } from '~core/types';
import { currentEventFeedAtom } from '~core/shared_state';

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
