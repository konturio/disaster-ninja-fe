import { useAction, useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import { memo, useCallback } from 'react';
import { i18n } from '~core/localization';
import { userResourceAtom } from '~core/auth';
import { currentEventFeedAtom } from '~core/shared_state';
import { scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { AppFeature } from '~core/auth/types';
import s from './FeedSelector.module.css';
import type { ChangeEvent } from 'react';

const FeedSelectorComp = () => {
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const [currentFeed, { setCurrentFeed }] = useAtom(currentEventFeedAtom);
  const scheduleAutoSelect = useAction(scheduledAutoSelect.setTrue);
  const onFeedChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      setCurrentFeed(ev.target.value);
      scheduleAutoSelect();
    },
    [setCurrentFeed, scheduleAutoSelect],
  );

  return userModel &&
    (userModel.hasFeature(AppFeature.FEED_SELECTOR) ||
      userModel.hasFeature(AppFeature.EVENTS_LIST__FEED_SELECTOR)) &&
    userModel.feeds &&
    userModel.feeds.length > 1 ? (
    <div className={s.feedSelectorContainer}>
      <Text type="short-m">{i18n.t('feed')}:</Text>
      <div>
        <select
          onChange={onFeedChange}
          value={currentFeed?.id || userModel.defaultFeed?.feed}
          className={s.feedsSelect}
        >
          {userModel.feeds.map((fd) => (
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
