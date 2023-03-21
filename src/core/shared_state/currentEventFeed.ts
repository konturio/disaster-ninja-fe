import { createAtom } from '~utils/atoms';
import { appConfig } from '~core/app_config';
import { eventFeedsAtom } from './eventFeeds';
import { currentEventAtom, scheduledAutoSelect } from './currentEvent';
import type { EventFeedConfig } from '~core/app/types';

type CurrentEventFeedAtomState = {
  id: string;
} | null;

export const currentEventFeedAtom = createAtom(
  {
    setCurrentFeed: (feedId: string) => feedId,
    setFeedForExistingEvent: (feedId: string) => feedId,
    resetCurrentFeed: () => null,
    eventFeedsAtom,
  },
  (
    { onAction, onChange, schedule, getUnlistedState },
    state: CurrentEventFeedAtomState = { id: appConfig.defaultFeed },
  ) => {
    onAction('setCurrentFeed', (feedId) => {
      if (state?.id !== feedId) {
        state = { id: feedId };
      }
    });

    onAction('resetCurrentFeed', () => {
      if (state) {
        state = null;
      }
    });

    onChange('eventFeedsAtom', (eventFeeds) => {
      if (eventFeeds && eventFeeds.length) {
        const newFeed = checkFeed(eventFeeds, state?.id);
        if (newFeed !== undefined && newFeed !== state?.id) {
          state = { id: newFeed };
          const currentEvent = getUnlistedState(currentEventAtom);
          if (currentEvent !== null)
            schedule((dispatch) => dispatch(scheduledAutoSelect.setTrue()));
        }
      }
    });

    return state;
  },
  '[Shared state] currentEventFeedAtom',
);

function checkFeed(eventFeeds: EventFeedConfig[], feedId?: string) {
  if (!feedId) return appConfig.defaultFeed;
  const feed = eventFeeds?.find((fd) => fd.feed === feedId);
  return feed ? feed.feed : appConfig.defaultFeed;
}
