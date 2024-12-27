import type { EventType, Severity } from '~core/types';
import type { EventSortConfig } from './atoms/eventSortingConfig';

// event filters applied on front-end side
export type LocalEventListFilters = {
  excludedEventTypes?: EventType[];
  minAffectedPopulation?: number;
  minSeverity?: Severity;
  minStartedAt?: string;
  minUpdatedAt?: string;
};

export type EventsListFeatureConfig = {
  initialSort?: EventSortConfig;
  filters?: LocalEventListFilters;
};
