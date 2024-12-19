import { SEVERITY_SORTING_SCORES } from '../constants';
import type { Event, EventType, Severity } from '~core/types';

export function filterByMinUpdatedAt(events: Event[], minDateString: string): Event[] {
  const minTime = new Date(minDateString).getTime();
  if (minTime) {
    return events.filter((event) => {
      return event.updatedAt && new Date(event.updatedAt).getTime() >= minTime;
    });
  }
  return events;
}

export function filterByMinStartedAt(events: Event[], minDateString: string): Event[] {
  const minTime = new Date(minDateString).getTime();
  if (minTime) {
    return events.filter((event) => {
      return event.updatedAt && new Date(event.updatedAt).getTime() >= minTime;
    });
  }
  return events;
}

export function filterByMinAffectedPopulation(
  events: Event[],
  minAffectedPopulation: number,
): Event[] {
  if (minAffectedPopulation > 0) {
    return events.filter((event) => {
      return event.affectedPopulation >= minAffectedPopulation;
    });
  }
  return events;
}

export function filterByMinSeverity(events: Event[], minSeverity: Severity): Event[] {
  const minSeverityScore = SEVERITY_SORTING_SCORES[minSeverity];
  if (minSeverityScore > 0) {
    return events.filter((event) => {
      return (
        SEVERITY_SORTING_SCORES[event.severity] &&
        SEVERITY_SORTING_SCORES[event.severity] >= minSeverityScore
      );
    });
  }
  return events;
}

export function filterByExcludedEventTypes(
  events: Event[],
  excludedEventTypes: EventType[],
): Event[] {
  return events;
  if (excludedEventTypes.length > 0) {
    return events.filter((event) => {
      if (event.eventType) {
        return !excludedEventTypes.includes(event.eventType);
      }
    });
  }
  return events;
}
