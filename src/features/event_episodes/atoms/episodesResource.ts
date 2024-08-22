import { nanoid } from 'nanoid';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
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

export const episodesResource = createAsyncAtom(
  episodesResourceDependencyAtom,
  async (deps, abortController) => {
    if (deps && deps.event?.id && deps.feed?.id) {
      const responseData = await apiClient.get<Episode[]>(
        `/events/${deps.feed.id}/${deps.event.id}/episodes`,
        undefined,
        true,
        { signal: abortController.signal },
      );
      if (!responseData) throw 'No data received';

      // Adapter:
      // - add missing ids
      // - set default value for forecasted flag;
      return responseData.map((e) => {
        const copy = { ...e };
        if (!copy.hasOwnProperty('id')) copy.id = 'temp_' + nanoid(6);
        if (!copy.hasOwnProperty('forecasted')) copy.forecasted = false;
        return copy;
      });
    }
    return null;
  },
  'episodesResource',
);
