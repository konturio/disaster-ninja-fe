import { createAtom } from '~utils/atoms';
import { userResourceAtom } from '~core/auth';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import {
  UpdateCallbackLayersType,
  updateCallbackService,
} from '~core/update_callbacks';

type CurrentEventFeedAtomState = {
  id: string;
} | null;

export const currentEventFeedAtom = createAtom(
  {
    setCurrentFeed: (feedId: string) => feedId,
    setFeedForExistingEvent: (feedId: string) => feedId,
    resetCurrentFeed: () => null,
    userResourceAtom,
  },
  (
    { onAction, onChange, schedule },
    state: CurrentEventFeedAtomState = null,
  ) => {
    onAction('setCurrentFeed', (feedId) => {
      if (state?.id !== feedId) {
        schedule((dispatch) => {
          dispatch(currentEventAtom.resetCurrentEvent());
        });
        state = { id: feedId };
      }
    });
    onAction('setFeedForExistingEvent', (feedId) => {
      if (state?.id !== feedId) {
        state = { id: feedId };
      }
    });
    onAction('resetCurrentFeed', () => {
      if (state) {
        schedule((dispatch) => {
          dispatch(currentEventAtom.resetCurrentEvent());
        });
        state = null;
      }
    });
    onChange('userResourceAtom', ({ data, loading, error }) => {
      if (!loading && !error && data && data.feeds && data.feeds.length) {
        const newFeed = data.checkFeed(state?.id);
        if (newFeed !== undefined) {
          state = { id: newFeed };
        }
      }
    });
    return state;
  },
  '[Shared state] currentEventFeedAtom',
);
