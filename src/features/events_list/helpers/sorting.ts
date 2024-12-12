import type { Event } from '~core/types';

export function sortEventsByStartDate(events: Event[], order: 'asc' | 'desc'): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.startedAt ?? 0).getTime();
    const dateB = new Date(b.startedAt ?? 0).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}
