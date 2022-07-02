import { createAtom } from '~utils/atoms';
import { userResourceAtom } from '~core/auth/atoms/userResource';

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
        state = null;
      }
    });
    onChange('userResourceAtom', ({ data, loading, error }) => {
      if (!loading && !error && data && data.feeds && data.feeds.length) {
        const newFeed = data.checkFeed(state?.id);
        if (newFeed !== undefined && newFeed !== state?.id) {
          state = { id: newFeed };
        }
      }
    });
    return state;
  },
  '[Shared state] currentEventFeedAtom',
);
