import { useAtom } from '@reatom/react';
import { memo, useCallback } from 'react';
import { i18n } from '~core/localization';
import { userResourceAtom } from '~core/auth';
import { currentEventFeedAtom } from '~core/shared_state';
import { AppFeature } from '~core/auth/types';
import { featureStatus } from '~core/featureStatus';
import s from './FeedSelector.module.css';
import type { ChangeEvent } from 'react';

const FeedSelectorComp = () => {
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const [currentFeed, { setCurrentFeed }] = useAtom(currentEventFeedAtom);

  const onFeedChange = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    setCurrentFeed(ev.target.value);
  }, []);

  // todo think about it in #11232
  featureStatus.markReady(AppFeature.FEED_SELECTOR);

  return userModel &&
    userModel.hasFeature(AppFeature.FEED_SELECTOR) &&
    userModel.feeds &&
    userModel.feeds.length > 1 ? (
    <div className={s.feedSelectorContainer}>
      <div>{i18n.t('Feed')}:</div>
      <div>
        <select
          onChange={onFeedChange}
          value={currentFeed?.id || userModel.defaultFeed?.feed}
          className={s.feedsSelect}
        >
          {userModel.feeds.map((fd) => (
            <option key={fd.feed} value={fd.feed}>
              {fd.feed}
            </option>
          ))}
        </select>
      </div>
    </div>
  ) : null;
};

export const FeedSelector = memo(FeedSelectorComp);
