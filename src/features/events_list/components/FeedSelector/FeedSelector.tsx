import { useAction, useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import { memo, useCallback } from 'react';
import { appConfig } from '~core/app_config';
import { i18n } from '~core/localization';
import { scheduledAutoSelect } from '~core/shared_state/currentEvent';
import {
  currentEventFeedAtom,
  eventFeedsAtom,
  featureFlagsAtom,
  FeatureFlag,
} from '~core/shared_state';
import s from './FeedSelector.module.css';
import type { ChangeEvent } from 'react';

const FeedSelectorComp = () => {
  const [featureFlags] = useAtom(featureFlagsAtom);
  const [eventFeeds] = useAtom(eventFeedsAtom);
  const [currentFeed, { setCurrentFeed }] = useAtom(currentEventFeedAtom);
  const scheduleAutoSelect = useAction(scheduledAutoSelect.setTrue);
  const onFeedChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      setCurrentFeed(ev.target.value);
      scheduleAutoSelect();
    },
    [setCurrentFeed, scheduleAutoSelect],
  );

  return (featureFlags[FeatureFlag.FEED_SELECTOR] ||
    featureFlags[FeatureFlag.EVENTS_LIST__FEED_SELECTOR]) &&
    eventFeeds &&
    eventFeeds.length > 1 ? (
    <div className={s.feedSelectorContainer}>
      <Text type="short-m">{i18n.t('feed')}:</Text>
      <div>
        <select
          onChange={onFeedChange}
          value={currentFeed?.id || appConfig.defaultFeedObject.feed}
          className={s.feedsSelect}
        >
          {eventFeeds.map((fd) => (
            <option key={fd.feed} value={fd.feed}>
              {fd.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  ) : null;
};

export const FeedSelector = memo(FeedSelectorComp);
