import { lazily } from 'react-lazily';
import { useAtom } from '@reatom/react-v2';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';

const { FeedSelector } = lazily(() => import('./FeedSelector'));

export function FeedSelectorFlagged() {
  const [featureFlags] = useAtom(featureFlagsAtom);
  const feedSelectorEnabled =
    featureFlags[FeatureFlag.FEED_SELECTOR] ||
    featureFlags[FeatureFlag.EVENTS_LIST__FEED_SELECTOR];

  return feedSelectorEnabled && <FeedSelector />;
}
