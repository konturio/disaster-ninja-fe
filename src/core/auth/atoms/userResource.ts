import { apiClient } from '~core/index';
import { createAtom, createResourceAtom } from '~utils/atoms';
import { CurrentUser, currentUserAtom } from '~core/shared_state/currentUser';
import { currentApplicationAtom } from '~core/shared_state/currentApplication';

import { UserDataModel } from '~core/auth';
import { AppFeature, UserFeed } from '~core/auth/models/UserDataModel';
import config from '~core/app_config';

type UserResourceRequestParams = {
  userData?: CurrentUser;
  applicationId?: string | null;
};

const userResourceRequestParamsAtom = createAtom(
  {
    currentUserAtom,
    currentApplicationAtom,
  },
  (
    { get },
    state: UserResourceRequestParams = {},
  ): UserResourceRequestParams => {
    return {
      userData: get('currentUserAtom'),
      applicationId: get('currentApplicationAtom'),
    };
  },
  'userResourceRequestParamsAtom',
);

export const userResourceAtom = createResourceAtom<
  UserResourceRequestParams,
  UserDataModel | undefined
>(
  async (params) => {
    if (!params) return;
    const { userData, applicationId } = params;

    // TODO: Remove full address when Userprofile API service will be moved to the main app API
    const query = { appId: applicationId };
    const featuresResponse = apiClient.get<unknown>(
      config.featuresApi,
      query,
      userData?.id !== 'public',
    );
    const feedsResponse = apiClient.get<unknown>(
      '/events/user_feeds',
      undefined,
      userData?.id !== 'public',
    );

    const data = await Promise.all([featuresResponse, feedsResponse]);

    if (!data || !data[0] || !data[1]) {
      throw new Error('No user data received');
    }

    const features: { [T in AppFeature]?: boolean } = {};
    if (Array.isArray(data[0])) {
      data[0].forEach((ft: { name: AppFeature }) => {
        features[ft.name] = true;
      });
    }

    let feeds: UserFeed[] = [];
    if (Array.isArray(data[1])) {
      feeds = data[1].map((fd: { feed: string; default: boolean }) => ({
        feed: fd.feed,
        isDefault: fd.default,
      }));
    }

    const udm = new UserDataModel({ features, feeds });
    return udm;
  },
  userResourceRequestParamsAtom,
  'userResourceAtom',
);
