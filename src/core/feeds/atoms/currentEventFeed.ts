import { createAtom } from '~core/store/atoms';
import core from '../..';
import { currentEventAtom, scheduledAutoSelect } from './currentEvent';

type CurrentEventFeedAtomState = {
  id: string;
} | null;

export const currentEventFeedAtom = createAtom(
  {
    setCurrentFeed: (feedId: string) => feedId,
    setFeedForExistingEvent: (feedId: string) => feedId,
    resetCurrentFeed: () => null,
    feedsAtom: core.feeds.atom,
  },
  (
    { onAction, onChange, schedule, getUnlistedState },
    state: CurrentEventFeedAtomState = null,
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
    onChange('feedsAtom', ({ data, loading, error }) => {
      if (!loading && !error && data && data && data.length) {
        const currentFeedInNewFeedList = !!data.find(d => d.feed === state?.id);
        //  data.checkFeed(state?.id);
        if (!currentFeedInNewFeedList) {
          const defaultFeedInNewList = data.find(d => d.default) ?? data[0];
          state = { id: defaultFeedInNewList?.feed };
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
