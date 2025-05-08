import { useAction, useAtom } from '@reatom/react-v2';
import { Select, type SelectableItem } from '@konturio/ui-kit';
import { useCallback } from 'react';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { eventFeedsAtom } from '~core/shared_state/eventFeeds';
import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
import s from './FeedSelector.module.css';

type FeedItem = {
  title: string;
  value: string;
};

export function FeedSelector() {
  const [eventFeeds] = useAtom(eventFeedsAtom);
  const [currentFeed, { setCurrentFeed }] = useAtom(currentEventFeedAtom);
  const scheduleAutoSelect = useAction(scheduledAutoSelect.setTrue);

  const mappedItems: FeedItem[] =
    eventFeeds.data?.map((fd) => ({
      title: fd.name,
      value: fd.feed,
    })) || [];

  const handleSelect = useCallback(
    (selection: SelectableItem | SelectableItem[] | null | undefined) => {
      if (!selection || Array.isArray(selection)) return;

      setCurrentFeed(selection.value as string);
      scheduleAutoSelect();
    },
    [setCurrentFeed, scheduleAutoSelect],
  );

  if (eventFeeds.data?.length < 2) {
    return null;
  }

  return (
    <div className={s.feedSelectorContainer}>
      <Select
        label={i18n.t('feed')}
        items={mappedItems}
        onSelect={handleSelect}
        value={currentFeed?.id || configRepo.get().defaultFeed}
        type="inline"
        showSelectedIcon={false}
        className={s.feedsSelect}
      />
    </div>
  );
}
