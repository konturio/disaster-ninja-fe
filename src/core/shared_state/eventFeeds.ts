import { createAtom } from '~utils/atoms';
import { configRepo } from '~core/config';
import {
  eventFeedsResourceAtom,
  type EventFeed,
} from '~core/resources/eventFeedsResource';
import { i18n } from '~core/localization';
import { currentEventFeedAtom } from './currentEventFeed';

const defaultFeeds: EventFeed[] = [getDefaultFeedObject(configRepo.getUserDefaultFeed())];

export const eventFeedsAtom = createAtom(
  {
    eventFeedsResourceAtom,
  },
  ({ get, schedule }, state = { data: defaultFeeds, loading: false }) => {
    const { data, error, loading } = get('eventFeedsResourceAtom');
    state = { ...state, loading };
    if (!loading && !error) {
      if (data) {
        console.assert(
          data.map((d) => d.feed).includes(configRepo.getUserDefaultFeed()),
          'default feed not included in response',
        );
        state = { data, loading };
      } else {
        state = { data: [...defaultFeeds], loading };
      }
      schedule((dispatch) => dispatch(currentEventFeedAtom.syncFeed(state)));
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
