import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { apiClient } from '~core/apiClientInstance';

export interface EventFeed {
  feed: string;
  name: string;
  description: string;
  default: boolean;
}

export const eventFeedsResourceAtom = createAsyncAtom(
  null,
  async (_, abortController) => {
    const feedsResponse = apiClient.get<EventFeed[]>(
      '/events/user_feeds',
      undefined,
      true,
      { signal: abortController.signal },
    );
    return feedsResponse;
  },
  'eventFeedsResource',
);
