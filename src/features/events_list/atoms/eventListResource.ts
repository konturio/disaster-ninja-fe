import { combineAtoms } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { currentEventFeedAtom } from '~core/shared_state';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/auth/types';
import { eventListFilters } from './eventListFilters';
import type { Event } from '~core/types';

const depsAtom = combineAtoms({
  currentFeed: currentEventFeedAtom,
  filters: eventListFilters,
});

export const eventListResourceAtom = createAsyncAtom(
  depsAtom,
  async (deps, abortController) => {
    const params: {
      feed?: string;
      bbox?: string;
    } = {
      feed: deps?.currentFeed?.id,
      bbox: deps?.filters.bbox?.join(','),
    };

    const responseData =
      (await apiClient.get<Event[]>('/events/', params, true, {
        signal: abortController.signal,
      })) ?? ([] as Event[]);

    dispatchMetricsEventOnce(AppFeature.EVENTS_LIST, responseData.length > 0);

    if (responseData.length === 0) {
      if (params.bbox) throw new Error('No disasters in this area');
      if (params.feed) throw new Error('No disasters in this feed');
      throw new Error('No disasters');
    }

    return responseData;
  },
  'eventListResource',
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
