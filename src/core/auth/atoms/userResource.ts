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

    const [featuresSettled, feedsSettled] = await Promise.allSettled([
      featuresResponse,
      feedsResponse,
    ]);

    const features: { [T in AppFeature]?: boolean } = {};
    if (
      featuresSettled.status === 'fulfilled' &&
      Array.isArray(featuresSettled.value)
    ) {
      featuresSettled.value.forEach((ft: { name: AppFeature }) => {
        features[ft.name] = true;
      });
    } else if (featuresSettled.status === 'rejected') {
      console.error('Feature api call failed');
    }

    let feeds: UserFeed[] | null = null;
    if (
      feedsSettled.status === 'fulfilled' &&
      Array.isArray(feedsSettled.value)
    ) {
      feeds = feedsSettled.value.map(
        (fd: { feed: string; default: boolean }) => ({
          feed: fd.feed,
          isDefault: fd.default,
        }),
      );
    } else if (feedsSettled.status === 'rejected') {
      console.error('User feeds call failed');
    }

    const udm = new UserDataModel({ features, feeds });
    return udm;
  },
  userResourceRequestParamsAtom,
  'userResourceAtom',
);
