import { useAtom } from '@reatom/react';
import { TranslationService as i18n } from '~core/localization';
import { userResourceAtom } from '~core/auth';
import { ChangeEvent, memo, useCallback } from 'react';
import s from './FeedSelector.module.css';
import { currentEventFeedAtom } from '~core/shared_state';

const FeedSelectorComp = () => {
  const [{ data }] = useAtom(userResourceAtom);
  const [currentFeed] = useAtom(currentEventFeedAtom);

  const onFeedChange = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    currentEventFeedAtom.setCurrentFeed.dispatch(ev.target.value);
  }, []);

  return data &&
    data.features?.feed_selector === true &&
    data.feeds &&
    data.feeds.length > 1 ? (
    <div className={s.feedSelectorContainer}>
      <div>{i18n.t('Feed')}:</div>
      <div>
        <select
          onChange={onFeedChange}
          defaultValue={currentFeed?.id || data.defaultFeed?.feed}
          className={s.feedsSelect}
        >
          {data.feeds.map((fd) => (
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
