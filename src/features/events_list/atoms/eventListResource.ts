import { apiClient } from '~core/apiClientInstance';
import { AppFeature } from '~core/app/types';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { i18n } from '~core/localization';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
import { combineAtoms } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
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
      (await apiClient.get<Event[]>('/events/', params, {
        signal: abortController.signal,
        errorsConfig: { hideErrors: true },
      })) ?? ([] as Event[]);

    dispatchMetricsEventOnce(AppFeature.EVENTS_LIST, responseData.length > 0);

    if (responseData.length === 0) {
      if (params.bbox) throw new Error(i18n.t('event_list.no_historical_disasters'));
      if (params.feed) throw new Error(i18n.t('event_list.no_feed_disasters'));
      throw new Error(i18n.t('event_list.no_disasters'));
    }



    return responseData;
  },
  'eventListResource',
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
