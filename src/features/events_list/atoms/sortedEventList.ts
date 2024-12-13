import { atom } from '@reatom/framework';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { sortEventsByStartDate } from '../helpers/sorting';
import { sortEventsByMcda } from '../helpers/eventsMcdaSort';
import { eventListResourceAtom } from './eventListResource';
import type { Event } from '~core/types';

const eventsListFeature = configRepo.get().features[AppFeature.EVENTS_LIST];

const eventsListFeatureConfig = {
  initialSort: undefined as 'asc' | 'desc' | undefined,
  initialSortType: 'date' as 'date' | 'mcda' | undefined,
  ...(typeof eventsListFeature === 'object' ? eventsListFeature : {}),
};

export type EventSortingConfig = {
  order?: 'asc' | 'desc';
  sortType?: 'date' | 'mcda';
};

export const eventsSortingConfigAtom = atom<EventSortingConfig>(
  {
    order: eventsListFeatureConfig.initialSort,
    sortType: eventsListFeatureConfig.initialSortType,
  },
  'eventsSortingConfigAtom',
);

export type SortedEventListAtom = {
  data: Event[] | null;
  loading: boolean;
  error: string | null;
};

function sortEvents(data: Event[], eventsSortingConfig: EventSortingConfig): Event[] {
  if (eventsSortingConfig.order) {
    if (eventsSortingConfig.sortType === 'date') {
      return sortEventsByStartDate(data, eventsSortingConfig.order);
    }
    if (eventsSortingConfig.sortType === 'mcda') {
      return sortEventsByMcda(data, eventsSortingConfig.order);
    }
  }
  return data;
}

export const sortedEventListAtom = atom<SortedEventListAtom>((ctx) => {
  const eventListResource = ctx.spy(eventListResourceAtom.v3atom);
  const eventsSortingConfig = ctx.spy(eventsSortingConfigAtom);

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
