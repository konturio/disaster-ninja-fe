import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';
import type { Event } from '~core/types';

export interface EventListParams {
  feed?: string;
  bbox?: string;
}

export function getEventsList(params: EventListParams, abortController: AbortController) {
  return apiClient
    .get<Event[]>(
      '/events',
      {
        appId: configRepo.get().id,
        ...params,
      },
      true,
      {
        signal: abortController.signal,
        errorsConfig: { hideErrors: true },
      },
    )
    .then((response) => response ?? []); // Ensure we always return an array
}
