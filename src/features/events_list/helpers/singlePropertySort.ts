import type { Event } from '~core/types';

export function sortEventsBySingleProperty(
  events: Event[],
  propertyName: string,
  order: 'asc' | 'desc',
): Event[] {
  if (propertyName === 'startedAt' || propertyName === 'updatedAt') {
    return sortEvents(events, order, dateExtractor(propertyName));
  }
  console.error(
    `Cannot sort by "${propertyName}" property. Returning the original array.`,
  );
  return events;
}

const dateExtractor = (propertyName: string) => (event: Event) =>
  new Date(event?.[propertyName] ?? 0).getTime();

export function sortEvents(
  events: Event[],
  order: 'asc' | 'desc',
  valueExtractor: (event: Event) => number,
): Event[] {
  return [...events].sort((a, b) => {
    const valueA = valueExtractor(a);
    const valueB = valueExtractor(b);
    return order === 'desc' ? valueB - valueA : valueA - valueB;
  });
}
