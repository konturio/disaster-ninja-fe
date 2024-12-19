import { atom } from '@reatom/framework';
import { isNumber } from '~utils/common';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { sortEventsBySingleProperty } from '../helpers/singlePropertySort';
import { sortEventsByMcda } from '../helpers/eventsMcdaSort';
import {
  filterByExcludedEventTypes,
  filterByMinAffectedPopulation,
  filterByMinSeverity,
  filterByMinStartedAt,
  filterByMinUpdatedAt,
} from '../helpers/eventFilters';
import { eventSortingConfigAtom } from './eventSortingConfig';
import { eventListResourceAtom } from './eventListResource';
import { localEventFiltersAtom } from './localEventListFiltersConfig';
import type { LocalEventListFilters } from '../types';
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

function applyLocalEventListFilters(
  data: Event[],
  filtersConfig: LocalEventListFilters,
): Event[] {
  let result = data;
  if (isNumber(filtersConfig.minAffectedPopulation)) {
    result = filterByMinAffectedPopulation(data, filtersConfig.minAffectedPopulation);
  }
  if (filtersConfig.minSeverity) {
    result = filterByMinSeverity(result, filtersConfig.minSeverity);
  }
  if (filtersConfig.excludedEventTypes) {
    result = filterByExcludedEventTypes(result, filtersConfig.excludedEventTypes);
  }
  if (filtersConfig.minUpdatedAt) {
    result = filterByMinUpdatedAt(result, filtersConfig.minUpdatedAt);
  }
  if (filtersConfig.minStartedAt) {
    result = filterByMinStartedAt(result, filtersConfig.minStartedAt);
  }
  return result;
}

export const sortedEventListAtom = atom<SortedEventListAtom>((ctx) => {
  const eventListResource = ctx.spy(eventListResourceAtom.v3atom);
  const eventsSortingConfig = ctx.spy(eventSortingConfigAtom);
  const eventsFiltersConfig = ctx.spy(localEventFiltersAtom);

  if (
    !eventListResource.loading &&
    !eventListResource.error &&
    eventListResource.data?.length
  ) {
    let data = eventListResource.data;
    if (eventsFiltersConfig) {
      // filter event list
      data = applyLocalEventListFilters(data, eventsFiltersConfig);
    }

    if (eventsSortingConfig) {
      // sort event list
      data = sortEvents(data, eventsSortingConfig);
    }

    const currentEvent = currentEventAtom.getState();
    if (currentEvent?.id) {
      if (data.findIndex((d) => d.eventId === currentEvent?.id) === -1) {
        // selected event is not in the sorted list, reset selection
        currentEventAtom.setCurrentEventId.dispatch(null);
      }
    }

    return {
      data,
      loading: eventListResource.loading,
      error: eventListResource.error,
    };
  }
  return eventListResource;
}, 'sortedEventListAtom');
