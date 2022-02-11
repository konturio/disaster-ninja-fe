import { createBindAtom, createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { currentEventAtom, currentEventFeedAtom } from '~core/shared_state';
import { EventWithGeometry } from '~core/types';

const eventDependencyAtom = createBindAtom(
  { currentEventAtom, currentEventFeedAtom },
  (
    { get },
    state: { event: { id: string } | null; feed: { id: string } | null } = {
      event: null,
      feed: null,
    },
  ) => {
    const event = get('currentEventAtom');
    const feed = get('currentEventFeedAtom');
    return { event, feed };
  },
);

export const currentEventResourceAtom = createResourceAtom(
  eventDependencyAtom,
  async (deps) => {
    if (deps && deps.event?.id && deps.feed?.id) {
      const responseData = await apiClient.get<EventWithGeometry>(
        `/events/${deps.feed.id}/${deps.event.id}`
      );
      if (responseData === undefined) throw 'No data received';
      return responseData;
    }
    return null;
  },
  'currentEventResource',
);
