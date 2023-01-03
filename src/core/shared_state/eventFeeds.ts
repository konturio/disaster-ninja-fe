import { createAtom } from '~utils/atoms';
import { appConfig } from '~core/app_config';

const defaultFeeds = [appConfig.defaultFeedObject];

export const eventFeedsAtom = createAtom(
  {
    set: (state = defaultFeeds) => state,
  },
  ({ onAction }, state = defaultFeeds) => {
    onAction('set', (f) => {
      if (f) {
        state = f;
      } else {
        // reset to defaults
        state = defaultFeeds;
      }
    });

    // TODO: fetch user feeds on login

    return state;
  },
  '[Shared state] eventFeeds',
);
