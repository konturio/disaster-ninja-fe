import { createAtom } from '~utils/atoms';
import { configRepo } from '~core/config';
import { eventFeedsResourceAtom } from '~core/resources/eventFeedsResource';
import { i18n } from '~core/localization';

const defaultFeeds = [getDefaultFeedObject(configRepo.get().defaultFeed)];

export const eventFeedsAtom = createAtom(
  {
    eventFeedsResourceAtom,
  },
  ({ get }, state = defaultFeeds) => {
    const { data, error, loading } = get('eventFeedsResourceAtom');
    if (!loading && !error) {
      if (data) {
        console.assert(
          data.map((d) => d.feed).includes(configRepo.get().defaultFeed),
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

// localized default feed object
function getDefaultFeedObject(feed?: string) {
  // Change this solution when new default feed will be added
  if (!feed || feed !== 'kontur-public')
    console.warn('WARNING! Default feed provided via config is incorrect or absent');
  return {
    feed: 'kontur-public',
    name: i18n.t('configs.Kontur_public_feed'),
    description: i18n.t('configs.Kontur_public_feed_description'),
    default: true,
  };
}
