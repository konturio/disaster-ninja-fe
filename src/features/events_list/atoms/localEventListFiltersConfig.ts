import { atom } from '@reatom/framework';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import type { EventsListFeatureConfig, LocalEventListFilters } from '../types';

function getLocalFiltersConfig(): LocalEventListFilters | null {
  const eventsListFeature: EventsListFeatureConfig = configRepo.get().features[
    AppFeature.EVENTS_LIST
  ] as EventsListFeatureConfig;
  const defaultFiltersConfig = eventsListFeature?.filters
    ? structuredClone(eventsListFeature?.filters)
    : null;
  return defaultFiltersConfig;
}

export const localEventFiltersAtom = atom<LocalEventListFilters | null>(
  getLocalFiltersConfig(),
  'localEventFiltersAtom',
);
