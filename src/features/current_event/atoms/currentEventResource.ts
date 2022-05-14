import { createAtom, createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { currentEventAtom, currentEventFeedAtom } from '~core/shared_state';
import { EventWithGeometry } from '~core/types';

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

export const currentEventResourceAtom = createResourceAtom(
  async (deps) => {
    if (deps && deps.event?.id && deps.feed?.id) {
      const responseData = await apiClient.get<EventWithGeometry>(
        `/events/${deps.feed.id}/${deps.event.id}`,
      );
      if (responseData === undefined) throw 'No data received';
      return responseData;
    }
    return null;
  },
  eventDependencyAtom,
  'currentEventResource',
);
