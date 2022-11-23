import { createAtom } from '~core/store/atoms';
import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import { UserStateStatus } from '~core/auth';
import type { Store } from '@reatom/core';
import type { ApiClient } from '~core/api_client';
import type { AuthenticationService } from '~core/auth';
import type { UserFeed } from '../types';

export const createFeedsAtom = ({
  defaultFeeds,
  client,
  store,
  authAtom,
}: {
  defaultFeeds: UserFeed[];
  client: ApiClient;
  store: Store;
  authAtom: AuthenticationService['atom'];
}) => {
  const paramsAtom = createAtom(
    {
      authAtom,
    },
    ({ get }) => {
      return get('authAtom') == UserStateStatus.AUTHORIZED;
    },
    {
      store,
      id: 'paramsFeaturesAtom',
    },
  );

  return createAsyncAtom(
    paramsAtom,
    async (isPublic, abortController) => {
      // if user not logged in - avoid extra request for feed
      if (isPublic) {
        return defaultFeeds;
      } else {
        try {
          const response = await client.get<UserFeed[]>(
            '/events/user_feeds',
            undefined,
            true,
            { signal: abortController.signal },
          );
          if (response === null) throw Error('Unavailable feed');
          return response;
        } catch (e) {
          console.error('User feeds call failed. Applying default feed...');
          return defaultFeeds;
        }
      }
    },
    'feedsAtom',
    { store },
  );
};

export type FeedsAtom = ReturnType<typeof createFeedsAtom>;
