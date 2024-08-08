import { i18n } from '~core/localization';
import { combineAtoms } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { autoRefreshService } from '~core/autoRefreshServiceInstance';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/app/types';
import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
import { currentEventAtom } from '~core/shared_state/currentEvent';
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
      if (responseData.findIndex((d) => d.eventId === currentEvent?.id) === -1) {
        // selected event is not in list, reset selection
        currentEventAtom.setCurrentEventId.dispatch(null);
      }
    }

    return responseData;
  },
  'eventListResource',
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
