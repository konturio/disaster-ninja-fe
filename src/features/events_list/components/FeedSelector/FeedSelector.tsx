import { useAction, useAtom } from '@reatom/react-v2';
import { Text } from '@konturio/ui-kit';
import { useCallback } from 'react';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { currentEventFeedAtom, eventFeedsAtom } from '~core/shared_state';
import s from './FeedSelector.module.css';
import type { ChangeEvent } from 'react';

export function FeedSelector() {
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

  if (eventFeeds.data?.length < 2) {
    return null;
  }

  return (
    <div className={s.feedSelectorContainer}>
      <Text type="short-m">{i18n.t('feed')}:</Text>
      <div>
        <select
          onChange={onFeedChange}
          value={currentFeed?.id || configRepo.get().defaultFeed}
          className={s.feedsSelect}
        >
          {eventFeeds.data.map((fd) => (
            <option key={fd.feed} value={fd.feed}>
              {fd.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
