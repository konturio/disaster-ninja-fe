import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';

export const currentApplicationAtom = createPrimitiveAtom<null | string>(
  null,
  null,
  '[Shared state] currentApplicationAtom',
);

type AppInfoResponse = {
  id: string;
  name: string;
  description: string;
  ownedByUser: boolean;
  features: string[];
  sidebarIconUrl: string;
  faviconUrl: string;
  public: boolean;
};

export const currentAppPropertiesResourceAtom = createAsyncAtom(
  currentApplicationAtom,
  async (appId, abortController) => {
    if (!appId) return null;
    const featuresResponse = await apiClient.get<AppInfoResponse>(
      `/apps/${appId}`,
      undefined,
      false,
      { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
    );
    return featuresResponse;
  },
  'app params atom',
);
