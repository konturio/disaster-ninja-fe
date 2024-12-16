import { action, atom } from '@reatom/framework';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { sortEventsBySingleProperty } from '../helpers/singlePropertySort';
import { MCDA_SORT_MOCK_CONFIG, sortEventsByMcda } from '../helpers/eventsMcdaSort';
import { eventListResourceAtom } from './eventListResource';
import type { SortByMCDAScoreConfig } from '~utils/mcda_sort/sortByMCDAScore';
import type { EventsListFeatureConfig } from '~core/config/types';
import type { Event } from '~core/types';

const DEFAULT_SORT_CONFIG_MCDA: SortConfig = {
  order: 'desc',
  config: { type: 'mcda', mcdaConfig: MCDA_SORT_MOCK_CONFIG },
};

const DEFAULT_SORT_SINGLE_PROPERTY: SortConfig = {
  order: 'desc',
  config: { type: 'singleProperty', propertyName: 'updatedAt' },
};

const DEFAULT_SORT_CONFIG: SortConfig = {};

export type SortConfig = {
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

function getEventSortConfig(): SortConfig {
  const eventsListFeature: EventsListFeatureConfig =
    typeof configRepo.get().features[AppFeature.EVENTS_LIST] === 'object'
      ? (configRepo.get().features[AppFeature.EVENTS_LIST] as EventsListFeatureConfig)
      : {};

  return eventsListFeature.initialSort
    ? eventsListFeature.initialSort
    : DEFAULT_SORT_CONFIG;
}

export const eventSortingConfigAtom = atom<EventsListFeatureConfig['initialSort']>(
  getEventSortConfig(),
  'eventSortingConfigAtom',
);

export const setEventSortingOrder = action((ctx, sortOrder: SortConfig['order']) => {
  const prevState = ctx.get(eventSortingConfigAtom);
  eventSortingConfigAtom(ctx, { ...(prevState ?? {}), order: sortOrder });
});

export type SortedEventListAtom = {
  data: Event[] | null;
  loading: boolean;
  error: string | null;
};

function sortEvents(
  data: Event[],
  eventsSortingConfig: EventsListFeatureConfig['initialSort'],
): Event[] {
  if (eventsSortingConfig?.order) {
    if (eventsSortingConfig.config?.type === 'singleProperty') {
      const propertyName = eventsSortingConfig.config?.propertyName;
      if (!propertyName) {
        console.error(
          'Could not find "singleProperty" property for singlePropertys sort',
        );
        return data;
      }
      return sortEventsBySingleProperty(data, propertyName, eventsSortingConfig.order);
    }
    if (eventsSortingConfig.config?.type === 'mcda') {
      if (!eventsSortingConfig.config.mcdaConfig) {
        console.error('Could not find "mcdaConfig" property for mcda sort');
        return data;
      }
      return sortEventsByMcda(
        data,
        eventsSortingConfig.config.mcdaConfig,
        eventsSortingConfig.order,
      );
    }
  }
  return data;
}

export const sortedEventListAtom = atom<SortedEventListAtom>((ctx) => {
  const eventListResource = ctx.spy(eventListResourceAtom.v3atom);
  const eventsSortingConfig = ctx.spy(eventSortingConfigAtom);

  if (
    !eventListResource.loading &&
    !eventListResource.error &&
    eventListResource.data?.length
  ) {
    const result: SortedEventListAtom = {
      data: sortEvents(eventListResource.data, eventsSortingConfig),
      loading: eventListResource.loading,
      error: eventListResource.error,
    };
    return result;
  }
  return eventListResource;
}, 'sortedEventListAtom');
