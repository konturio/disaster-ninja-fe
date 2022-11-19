import { nanoid } from 'nanoid';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createAtom } from '~utils/atoms';
import { currentEventAtom, currentEventFeedAtom } from '~core/shared_state';
import core from '~core/index';
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
      const responseData = await core.api.apiClient.get<Episode[]>(
        `/events/${deps.feed.id}/${deps.event.id}/episodes`,
        undefined,
        undefined,
        { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
      );
      if (!responseData) throw 'No data received';

      // Episodes not have any ids
      return responseData.map((e) => {
        if (!e.id) e.id = 'temp_' + nanoid(6);
        return e;
      });
    }
    return null;
  },
  'episodesResource',
);
