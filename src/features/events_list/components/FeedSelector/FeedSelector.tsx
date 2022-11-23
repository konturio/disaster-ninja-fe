import { useAction, useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import { memo, useCallback } from 'react';
import core from '~core/index';
import { scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { AppFeature } from '~core/app_features';
import s from './FeedSelector.module.css';
import type { ChangeEvent } from 'react';

const FeedSelectorComp = () => {
  const [features] = useAtom(core.features.atom);
  const [currentFeed, { setCurrentFeed }] = useAtom(core.sharedState.currentEventFeedAtom);
  const [feedsResource] = useAtom(core.feeds.atom);
  const scheduleAutoSelect = useAction(scheduledAutoSelect.setTrue);
  const onFeedChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      setCurrentFeed(ev.target.value);
      scheduleAutoSelect();
    },
    [setCurrentFeed, scheduleAutoSelect],
  );


  return features.has(AppFeature.FEED_SELECTOR) ||
    (features.has(AppFeature.EVENTS_LIST__FEED_SELECTOR) &&
      feedsResource.data &&
      feedsResource.data.length > 1) ? (
    <div className={s.feedSelectorContainer}>
      <Text type="short-m">{core.i18n.t('feed')}:</Text>
      <div>
        <select
          onChange={onFeedChange}
          value={currentFeed?.id || core.feeds.defaultFeed?.feed}
          className={s.feedsSelect}
        >
          {feedsResource.data!.map((fd) => (
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
