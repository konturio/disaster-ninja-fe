import { lazily } from 'react-lazily';
import { FeatureFlag } from '~core/shared_state';
import { configRepo } from '~core/config';

const { FeedSelector } = lazily(() => import('./FeedSelector'));
const featureFlags = configRepo.get().features;

export function FeedSelectorFlagged() {
  const feedSelectorEnabled =
    featureFlags[FeatureFlag.FEED_SELECTOR] ||
    featureFlags[FeatureFlag.EVENTS_LIST__FEED_SELECTOR];

  return feedSelectorEnabled && <FeedSelector />;
}
