import type { EventType, Severity } from '~core/types';
import type { EventSortConfig } from './atoms/eventSortingConfig';

// event filters applied on front-end side
export type LocalEventListFilters = {
  excludedEventTypes?: EventType[];
  eventTypes?: EventType[];
  minAffectedPopulation?: number;
  minSeverity?: Severity;
  minStartedAt?: string;
  maxStartedAt?: string;
  minUpdatedAt?: string;
  maxUpdatedAt?: string;
  country?: string;
  // minUpdatedAt has priority
  lastNDaysUpdatedAt?: number;
  // minStartedAt has priority
  lastNDaysStartedAt?: number;
};

export type EventsListFeatureConfig = {
  initialSort?: EventSortConfig;
  filters?: LocalEventListFilters;
};
