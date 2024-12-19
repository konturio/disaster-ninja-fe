import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { FeedSelectorFlagged } from '../FeedSelector';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';

const featureFlags = configRepo.get().features;

export function EventsPanelSettings() {
  return (
    <EventListSettingsRow>
      <FeedSelectorFlagged />
      {featureFlags[AppFeature.EVENTS_LIST__BBOX_FILTER] && <BBoxFilterToggle />}
      {/* TODO: for now we don't want these sort buttons, there was no design for them */}
      {/* <EventListSortButton
              onSort={onSort}
              onFocus={currentEventIndex !== undefined ? scrollToCurrentEvent : undefined}
            /> */}
    </EventListSettingsRow>
  );
}
