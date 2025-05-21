import { useAtom } from '@reatom/react-v2';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { eventListFilters } from '~features/events_list/atoms/eventListFilters';
import { BBoxFilterToggle } from '~components/BBoxFilterToggle/BBoxFilterToggle';
import { PanelSettingsRow } from '~components/PanelSettingsRow/PanelSettingsRow';
import { FeedSelectorFlagged } from '../FeedSelector';

const featureFlags = configRepo.get().features;

export function EventsPanelSettings() {
  const [bbox, { setBBoxFilterFromCurrentMapView, resetBboxFilter }] = useAtom(
    eventListFilters,
    (filters) => filters.bbox,
    [],
  );

  return (
    <PanelSettingsRow>
      <FeedSelectorFlagged />
      {featureFlags[AppFeature.EVENTS_LIST__BBOX_FILTER] && (
        <BBoxFilterToggle
          currentFilter={bbox}
          onSetFilter={setBBoxFilterFromCurrentMapView}
          onCleanFilter={resetBboxFilter}
        />
      )}
      {/* TODO: for now we don't want these sort buttons, there was no design for them */}
      {/* <EventListSortButton
              onSort={onSort}
              onFocus={currentEventIndex !== undefined ? scrollToCurrentEvent : undefined}
            /> */}
    </PanelSettingsRow>
  );
}
