import { action, atom } from '@reatom/framework';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import type { EventsListFeatureConfig } from '~core/config/types';
import type { SortByMCDAScoreConfig } from '~utils/mcda_sort/sortByMCDAScore';

const DEFAULT_SORT_CONFIG: EventSortConfig = {};

export type EventSortConfig = {
  order?: 'asc' | 'desc' | undefined;
  config?: MCDASortConfig | SinglePropertySortConfig;
};

export type MCDASortConfig = {
  type: 'mcda';
  mcdaConfig?: SortByMCDAScoreConfig;
};

export type SinglePropertySortConfig = {
  type: 'singleProperty';
  propertyName?: string;
};

function getEventSortConfig(): EventSortConfig {
  const eventsListFeature: EventsListFeatureConfig =
    typeof configRepo.get().features[AppFeature.EVENTS_LIST] === 'object'
      ? (configRepo.get().features[AppFeature.EVENTS_LIST] as EventsListFeatureConfig)
      : {};

  return eventsListFeature.initialSort
    ? eventsListFeature.initialSort
    : DEFAULT_SORT_CONFIG;
}

export const eventSortingConfigAtom = atom<EventSortConfig | undefined>(
  getEventSortConfig(),
  'eventSortingConfigAtom',
);

export const setEventSortingOrder = action((ctx, sortOrder: EventSortConfig['order']) => {
  const prevState = ctx.get(eventSortingConfigAtom);
  eventSortingConfigAtom(ctx, { ...(prevState ?? {}), order: sortOrder });
});
