import { createBindAtom } from '~utils/atoms/createBindAtom';
import { userResourceAtom } from '~core/auth';
import { currentEventAtom } from '~core/shared_state/currentEvent';

type CurrentEventFeedAtomState = {
  id: string;
} | null;

export const currentEventFeedAtom = createBindAtom(
  {
    setCurrentFeed: (feedId: string) => feedId,
    resetCurrentFeed: () => null,
    userResourceAtom
  },
  ({ onAction, onChange }, state: CurrentEventFeedAtomState = null) => {
    onAction('setCurrentFeed', (feedId) => {
      if (state?.id !== feedId) {
        currentEventAtom.resetCurrentEvent.dispatch();
        state = { id: feedId };
      }
    });
    onAction('resetCurrentFeed', () => {
      if (state) {
        currentEventAtom.resetCurrentEvent.dispatch();
        state = null;
      }
    });
    onChange('userResourceAtom', ( { data }) => {
      if (data && data.feeds && data.feeds.length) {
        const newFeed = data.checkFeed(state?.id);
        if (newFeed !== state?.id) {
          state = { id: newFeed };
        }
      }
    });
    return state;
  },
  '[Shared state] currentEventFeedAtom',
);
