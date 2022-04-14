import { useAtom } from '@reatom/react';
import { TranslationService as i18n } from '~core/localization';
import { userResourceAtom } from '~core/auth';
import { ChangeEvent, memo, useCallback } from 'react';
import s from './FeedSelector.module.css';
import { currentEventFeedAtom } from '~core/shared_state';
import { AppFeature } from '~core/auth/types';

const FeedSelectorComp = () => {
  const [{ data: userModel }] = useAtom(userResourceAtom);

  const onFeedChange = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    currentEventFeedAtom.setCurrentFeed.dispatch(ev.target.value);
  }, []);

  return userModel &&
    userModel.hasFeature(AppFeature.FEED_SELECTOR) &&
    userModel.feeds &&
    userModel.feeds.length > 1 ? (
    <div className={s.feedSelectorContainer}>
      <div>{i18n.t('Feed')}:</div>
      <div>
        <select
          onChange={onFeedChange}
          defaultValue={userModel.defaultFeed?.feed}
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
