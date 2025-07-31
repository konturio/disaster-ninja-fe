import { apiClient } from '~core/apiClientInstance';
import { AppFeature } from '~core/app/types';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { i18n } from '~core/localization';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
import { configRepo } from '~core/config';
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

    const currentEvent = currentEventAtom.getState();
    if (currentEvent?.id) {
      const currentEventInList = responseData.some((d) => d.eventId === currentEvent.id);
      const initUrl = configRepo.get().initialUrlData;
      const cameFromUrl =
        initUrl.event === currentEvent.id && initUrl.feed === params.feed;

      if (!currentEventInList && !cameFromUrl) {
        // Selected event is not in the list and wasn't provided via URL,
        // so we clear it to avoid pointing to a non-listed event
        currentEventAtom.setCurrentEventId.dispatch(null);
      }
    }

    return responseData;
  },
  'eventListResource',
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
