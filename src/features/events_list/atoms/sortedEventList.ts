import { atom } from '@reatom/framework';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { sortEventsByStartDate } from '../helpers/sorting';
import { eventListResourceAtom } from './eventListResource';
import type { Event } from '~core/types';

const eventsListFeature = configRepo.get().features[AppFeature.EVENTS_LIST];

const eventsListFeatureConfig = {
  initialSort: undefined as 'asc' | 'desc' | undefined,
  ...(typeof eventsListFeature === 'object' ? eventsListFeature : {}),
};

export type EventSortingConfig = {
  order: 'asc' | 'desc' | undefined;
};

export const eventsSortingConfigAtom = atom<EventSortingConfig>(
  { order: eventsListFeatureConfig.initialSort },
  'eventsSortingConfigAtom',
);

export type SortedEventListAtom = {
  data: Event[] | null;
  loading: boolean;
  error: string | null;
};

export const sortedEventListAtom = atom<SortedEventListAtom>((ctx) => {
  const eventListResource = ctx.spy(eventListResourceAtom.v3atom);
  const eventsSortingConfig = ctx.spy(eventsSortingConfigAtom);

  if (
    eventsSortingConfig.order &&
    !eventListResource.loading &&
    !eventListResource.error &&
    eventListResource.data?.length
  ) {
    const result: SortedEventListAtom = {
      data: sortEventsByStartDate(eventListResource.data, eventsSortingConfig.order),
      loading: eventListResource.loading,
      error: eventListResource.error,
    };
    return result;
  }
  return eventListResource;
}, 'sortedEventListAtom');
