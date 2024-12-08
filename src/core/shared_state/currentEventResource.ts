import { atom } from '@reatom/framework';
import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { i18n } from '~core/localization';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { currentEventAtom } from './currentEvent';
import { currentEventFeedAtom } from './currentEventFeed';
import type { EventWithGeometry } from '~core/types';

const eventDependencyAtom = atom((ctx) => {
  const event = ctx.get(currentEventAtom.v3atom);
  if (!event) return { event: null, feed: null };

  const feed = ctx.get(currentEventFeedAtom.v3atom);
  return { event, feed };
}, 'eventDependencyAtom');

export const currentEventResourceAtom = createAsyncAtom(
  v3toV2(eventDependencyAtom),
  async (deps, abortController) => {
    if (deps && deps.event?.id && deps.feed?.id) {
      const responseData = await apiClient.get<EventWithGeometry>(
        `/events/${deps.feed.id}/${deps.event.id}`,
        undefined,
        true,
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
