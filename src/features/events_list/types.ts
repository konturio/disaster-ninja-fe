import type { EventType, Severity } from '~core/types';
import type { EventSortConfig } from './atoms/eventSortingConfig';

export type EventListFilters = {
  excludedEventTypes?: EventType[];
  minAffectedPopulation?: number;
  minSeverity?: Severity;
  minStartedAt?: string;
  minUpdatedAt?: string;
};

export type EventsListFeatureConfig = {
  initialSort?: EventSortConfig;
  filters?: EventListFilters;
};
