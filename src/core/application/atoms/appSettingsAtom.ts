import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import type { Store } from '@reatom/core';
import type { ApiClient } from '~core/api_client';
import type { AppInfoResponse } from '~core/types';

export const createAppSettingsAtom = ({
  client,
  readId,
  store,
}: {
  client: ApiClient;
  readId: () => string;
  store: Store;
}) => {
  return createAsyncAtom(
    null,
    async (userState, abortController) => {
      return client.get<AppInfoResponse>(`/apps/${readId()}`, {}, true, {
        signal: abortController.signal,
      });
    },
    'appSettingsAtom',
    { store },
  );
};

export type AppSettingsAtom = ReturnType<typeof createAppSettingsAtom>;
