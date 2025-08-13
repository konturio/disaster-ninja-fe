import { lazily } from 'react-lazily';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';

const { FeedSelector } = lazily(() => import('./FeedSelector'));
const featureFlags = configRepo.get().features;

export function FeedSelectorFlagged() {
  const feedSelectorEnabled = featureFlags[AppFeature.EVENTS_LIST__FEED_SELECTOR];

  return feedSelectorEnabled && <FeedSelector />;
}
