import { createAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { currentEventAtom, currentEventFeedAtom } from '~core/shared_state';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
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
);

export const currentEventResourceAtom = createAsyncAtom(
  eventDependencyAtom,
  async (deps, abortController) => {
    if (deps && deps.event?.id && deps.feed?.id) {
      const responseData = await apiClient.get<EventWithGeometry>(
        `/events/${deps.feed.id}/${deps.event.id}`,
        undefined,
        undefined,
        { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
      );
      if (responseData === undefined) throw 'No data received';
      return responseData;
    }
    return null;
  },
  'currentEventResource',
);
