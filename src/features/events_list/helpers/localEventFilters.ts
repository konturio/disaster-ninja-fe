import { SEVERITY_SORTING_SCORES } from '../constants';
import type { Event, EventType, Severity } from '~core/types';

export function filterByLastNDaysUpdatedAt(events: Event[], days: number): Event[] {
  const minTime = getNDaysBack(days).getTime();
  if (minTime > 0) {
    return filterByMinTime(events, minTime, (event) => event.updatedAt);
  }
  return events;
}

export function filterByLastNDaysStartedAt(events: Event[], days: number): Event[] {
  const minTime = getNDaysBack(days).getTime();
  if (minTime > 0) {
    return filterByMinTime(events, minTime, (event) => event.startedAt);
  }
  return events;
}

export function filterByMinUpdatedAt(events: Event[], minDateString: string): Event[] {
  const minTime = new Date(minDateString).getTime();
  if (minTime) {
    return filterByMinTime(events, minTime, (event) => event.updatedAt);
  }
  return events;
}

export function filterByMinStartedAt(events: Event[], minDateString: string): Event[] {
  const minTime = new Date(minDateString).getTime();
  if (minTime) {
    return filterByMinTime(events, minTime, (event) => event.startedAt);
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
  if (excludedEventTypes.length > 0) {
    return events.filter((event) => {
      if (event.eventType) {
        return !excludedEventTypes.includes(event.eventType);
      }
    });
  }
  return events;
}

function filterByMinTime(
  events: Event[],
  minTimeMs: number,
  fieldExtractor: (event: Event) => string,
): Event[] {
  return events.filter((event) => {
    return (
      fieldExtractor(event) && new Date(fieldExtractor(event)).getTime() >= minTimeMs
    );
  });
}

function getNDaysBack(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
