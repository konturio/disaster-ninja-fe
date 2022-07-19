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

    const responseData = await apiClient.get<Event[]>('/events/', params, true);
    if (responseData === undefined) throw new Error('No data received');
    if (responseData.length === 0) {
      throw params.bbox
        ? new Error('No disasters in this area')
        : new Error('No disasters');
    }
    return responseData;
  },
  depsAtom,
  'eventListResource',
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
