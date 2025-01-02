import {
  sortByMCDAScore,
  type SortByMCDAScoreConfig,
  type MCDASortCriteriaExtractor,
  isValidSortByMCDAScoreConfig,
} from '~utils/mcda_sort/sortByMCDAScore';
import { isNumber } from '~utils/common';
import { EVENT_TYPES_SORTING_SCORES, SEVERITY_SORTING_SCORES } from '../constants';
import type { Event } from '~core/types';

function getAffectedPopulationDensity(event: Event) {
  return isNumber(event.affectedPopulation) &&
    isNumber(event.settledArea) &&
    event.settledArea > 0
    ? event.affectedPopulation / event.settledArea
    : 0;
}

function getSettledArea(event: Event) {
  return Math.log(
    1 + (isNumber(event.settledArea) && event.settledArea >= 0 ? event.settledArea : 0),
  );
}

function getAffectedPopulation(event: Event) {
  return Math.log(
    1 +
      (isNumber(event.affectedPopulation) && event.affectedPopulation >= 0
        ? event.affectedPopulation
        : 0),
  );
}

const eventMcdaCriteriaExtractor: MCDASortCriteriaExtractor<Event> = (event: Event) => {
  const criteriaMap = new Map<string, number>();
  // eventType
  criteriaMap.set(
    'eventType',
    EVENT_TYPES_SORTING_SCORES[event.eventType] ?? EVENT_TYPES_SORTING_SCORES.OTHER,
  );
  // severity
  criteriaMap.set(
    'severity',
    SEVERITY_SORTING_SCORES[event.severity] ?? SEVERITY_SORTING_SCORES.UNKNOWN,
  );
  // affectedPopulation
  criteriaMap.set('affectedPopulation', getAffectedPopulation(event));
  // settledArea
  criteriaMap.set('settledArea', getSettledArea(event));
  // affectedPopulationDensity
  criteriaMap.set(
    'affectedPopulationDensity',
    Math.log(1 + getAffectedPopulationDensity(event)),
  );
  // updatedAt
  if (event.updatedAt) {
    criteriaMap.set('updatedAt', new Date(event.updatedAt).getTime());
  }
  // startedAt
  if (event.startedAt) {
    criteriaMap.set('startedAt', new Date(event.startedAt).getTime());
  }

  return criteriaMap;
};

export function sortEventsByMcda(
  events: Event[],
  config: SortByMCDAScoreConfig,
  sortOrder: 'desc' | 'asc',
) {
  if (!isValidSortByMCDAScoreConfig(config)) {
    console.warn('sortEventsByMcda: incorrect config. Returning the original array');
    return events;
  }
  return sortByMCDAScore(events, config, eventMcdaCriteriaExtractor, sortOrder);
}
