import { createAtom, createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { currentEventAtom, currentEventFeedAtom } from '~core/shared_state';
import type { Episode } from '~core/types';

const episodesResourceDependencyAtom = createAtom(
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
    // Unlisted because feed already change event
    const feed = getUnlistedState(currentEventFeedAtom);
    return { event, feed };
  },
);

export const episodesResource = createResourceAtom(
  async (deps) => {
    if (deps && deps.event?.id && deps.feed?.id) {
      const responseData = await apiClient.get<Episode[]>(
        `/events/${deps.feed.id}/${deps.event.id}/episodes`,
      );
      if (responseData === undefined) throw 'No data received';
      return responseData;
    }
    return null;
  },
  'episodesResource',
  episodesResourceDependencyAtom,
  true,
);
