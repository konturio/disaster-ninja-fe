import type { Event } from '~core/types';

export function sortEventsByDate(events: Event[], order: 'asc' | 'desc'): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.startedAt).getTime();
    const dateB = new Date(b.startedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}
