import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';
import { AUTH_REQUIREMENT } from '~core/auth/constants';

export interface EventFeed {
  feed: string;
  name: string;
  description: string;
  default: boolean;
}

export const eventFeedsResourceAtom = createAsyncAtom(
  null,
  async (_, abortController) => {
    const feedsResponse = apiClient.get<EventFeed[]>('/events/user_feeds', undefined, {
      signal: abortController.signal,
      authRequirement: AUTH_REQUIREMENT.MUST,
    });
    return feedsResponse;
  },
  'eventFeedsResource',
);
