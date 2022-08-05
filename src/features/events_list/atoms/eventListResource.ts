import { createResourceAtom, combineAtoms } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { currentEventFeedAtom } from '~core/shared_state';
import { eventListFilters } from './eventListFilters';
import type { Event } from '~core/types';

const depsAtom = combineAtoms({
  currentFeed: currentEventFeedAtom,
  filters: eventListFilters,
});

export const eventListResourceAtom = createResourceAtom(
  async (deps) => {
    const params: {
      feed?: string;
      bbox?: string;
    } = {
      feed: deps?.currentFeed?.id,
      bbox: deps?.filters.bbox?.join(','),
    };

    const responseData =
      (await apiClient.get<Event[]>('/events/', params, true)) ?? [];

    if (responseData.length === 0) {
      if (params.bbox) throw new Error('No disasters in this area');
      if (params.feed) throw new Error('No disasters in this feed');
      throw new Error('No disasters');
    }

    return responseData;
  },
  'eventListResource',
  depsAtom,
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
