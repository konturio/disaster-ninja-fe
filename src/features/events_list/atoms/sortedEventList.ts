import { atom } from '@reatom/framework';
import { sortEventsBySingleProperty } from '../helpers/singlePropertySort';
import { sortEventsByMcda } from '../helpers/eventsMcdaSort';
import { eventListResourceAtom } from './eventListResource';
import { eventSortingConfigAtom } from './eventSortingConfig';
import type { EventSortConfig } from './eventSortingConfig';
import type { Event } from '~core/types';

export type SortedEventListAtom = {
  data: Event[] | null;
  loading: boolean;
  error: string | null;
};

function sortEvents(data: Event[], eventsSortingConfig: EventSortConfig): Event[] {
  if (eventsSortingConfig.order !== 'none' && eventsSortingConfig.config) {
    if (eventsSortingConfig.config.type === 'singleProperty') {
      const propertyName = eventsSortingConfig.config?.propertyName;

      return sortEventsBySingleProperty(data, propertyName, eventsSortingConfig.order);
    }
    if (eventsSortingConfig.config.type === 'mcda') {
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
    eventsSortingConfig &&
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
