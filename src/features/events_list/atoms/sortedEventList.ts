import { atom } from '@reatom/framework';
import { isNumber } from '~utils/common';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { i18n } from '~core/localization';
import { sortEventsBySingleProperty } from '../helpers/singlePropertySort';
import { sortEventsByMcda } from '../helpers/eventsMcdaSort';
import {
  filterByExcludedEventTypes,
  filterByLastNDaysStartedAt,
  filterByLastNDaysUpdatedAt,
  filterByMinAffectedPopulation,
  filterByMinSeverity,
  filterByMinStartedAt,
  filterByMinUpdatedAt,
} from '../helpers/localEventFilters';
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
  // date filters
  if (filtersConfig.minUpdatedAt) {
    result = filterByMinUpdatedAt(result, filtersConfig.minUpdatedAt);
  } else if (isNumber(filtersConfig.lastNDaysUpdatedAt)) {
    result = filterByLastNDaysUpdatedAt(result, filtersConfig.lastNDaysUpdatedAt);
  }
  if (filtersConfig.minStartedAt) {
    result = filterByMinStartedAt(result, filtersConfig.minStartedAt);
  } else if (isNumber(filtersConfig.lastNDaysStartedAt)) {
    result = filterByLastNDaysStartedAt(result, filtersConfig.lastNDaysStartedAt);
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
    let error: string | null = null;
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

    if (!data.length) {
      error = i18n.t('event_list.no_feed_disasters_matching_your_filters');
    }

    return {
      data,
      loading: eventListResource.loading,
      error,
    };
  }

  // Always return consistent SortedEventListAtom shape
  return {
    data: eventListResource.data,
    loading: eventListResource.loading,
    error: eventListResource.error,
  };
}, 'sortedEventListAtom');
