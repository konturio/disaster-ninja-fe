import { createAtom } from '~utils/atoms';
import { appConfig } from '~core/app_config';
import { eventFeedsResourceAtom } from '~core/resources/eventFeedsResource';

const defaultFeeds = [appConfig.defaultFeedObject];

export const eventFeedsAtom = createAtom(
  {
    eventFeedsResourceAtom,
  },
  ({ get }, state = defaultFeeds) => {
    const { data, error, loading } = get('eventFeedsResourceAtom');
    if (!loading && !error) {
      if (data) {
        console.assert(
          data.map((d) => d.feed).includes(appConfig.defaultFeedObject.feed),
          'default feed not included in response',
        );
        return data;
      } else {
        return [...defaultFeeds];
      }
    }
    return state;
  },
  '[Shared state] eventFeeds',
);
