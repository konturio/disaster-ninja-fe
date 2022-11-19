import { combineAtoms } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import core from '~core/index';
import { eventListFilters } from './eventListFilters';
import type { Event } from '~core/types';

const depsAtom = combineAtoms({
  currentFeed: core.sharedState.currentEventFeedAtom,
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
      (await core.api.apiClient.get<Event[]>('/events/', params, true, {
        signal: abortController.signal,
        errorsConfig: { dontShowErrors: true },
      })) ?? ([] as Event[]);

    if (responseData.length === 0) {
      if (params.bbox) throw new Error('No disasters in this area');
      if (params.feed) throw new Error('No disasters in this feed');
      throw new Error('No disasters');
    }

    return responseData;
  },
  'eventListResource',
);

core.autoRefresh.addWatcher('eventList', eventListResourceAtom);
