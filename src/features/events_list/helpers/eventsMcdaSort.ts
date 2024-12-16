import {
  sortByMCDAScore,
  type SortByMCDAScoreConfig,
  type MCDASortCriteriaExtractor,
} from '~utils/mcda_sort/sortByMCDAScore';
import { isNumber } from '~utils/common';
import { EVENT_TYPES_SORTING_SCORES, SEVERITY_SORTING_SCORES } from '../constants';
import type { Event } from '~core/types';

const extractor: MCDASortCriteriaExtractor<Event> = (event: Event) => {
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
  criteriaMap.set(
    'affectedPopulation',
    Math.log(
      1 +
        (isNumber(event.affectedPopulation) && event.affectedPopulation >= 0
          ? event.affectedPopulation
          : 0),
    ),
  );
  // settledArea
  criteriaMap.set(
    'settledArea',
    Math.log(
      1 + (isNumber(event.settledArea) && event.settledArea >= 0 ? event.settledArea : 0),
    ),
  );
  // affectedPopulationDensity
  const affectedPopulationDensity =
    isNumber(event.affectedPopulation) &&
    isNumber(event.settledArea) &&
    event.settledArea > 0
      ? event.affectedPopulation / event.settledArea
      : 0;
  criteriaMap.set('affectedPopulationDensity', Math.log(1 + affectedPopulationDensity));
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
  sortOrder: 'desc' | 'asc' = 'desc',
) {
  return sortByMCDAScore(events, config, extractor, sortOrder);
}
