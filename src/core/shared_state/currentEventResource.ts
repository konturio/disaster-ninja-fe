import { createAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { i18n } from '~core/localization';
import { currentEventAtom } from './currentEvent';
import { currentEventFeedAtom } from './currentEventFeed';
import type { EventWithGeometry } from '~core/types';

const eventDependencyAtom = createAtom(
  { currentEventAtom },
  (
    { get, getUnlistedState },
    state: { event: { id: string } | null; feed: { id: string } | null } = {
      event: null,
      feed: null,
    },
  ) => {
    const event = get('currentEventAtom');
    if (!event) return { event: null, feed: state.feed };

    const feed = getUnlistedState(currentEventFeedAtom);
    return { event, feed };
  },
  'eventDependencyAtom',
);

export const currentEventResourceAtom = createAsyncAtom(
  eventDependencyAtom,
  async (deps, abortController) => {
    if (deps && deps.event?.id && deps.feed?.id) {
      const responseData = await apiClient.get<EventWithGeometry>(
        `/events/${deps.feed.id}/${deps.event.id}`,
        undefined,
        undefined,
        {
          signal: abortController.signal,
          errorsConfig: {
            messages: { 404: i18n.t('current_event.not_found_request') },
          },
        },
      );
      if (responseData === undefined) throw 'No data received';
      return responseData;
    }
    return null;
  },
  'currentEventResource',
);
