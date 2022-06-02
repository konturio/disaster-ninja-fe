import { apiClient } from '~core/index';
import { createAtom, createResourceAtom } from '~utils/atoms';
import { CurrentUser, currentUserAtom } from '~core/shared_state/currentUser';
import { currentApplicationAtom } from '~core/shared_state/currentApplication';
import appConfig from '~core/app_config';
import { UserDataModel } from '~core/auth';
import config from '~core/app_config';
import {
  AppFeatureType,
  BackendFeature,
  BackendFeed,
  UserFeed,
} from '~core/auth/types';
import { PUBLIC_USER_ID } from '~core/auth/constants';

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

    const featuresResponse = apiClient.get<BackendFeature[]>(
      config.featuresApi,
      query,
      userData?.id !== PUBLIC_USER_ID,
      { errorsConfig: { dontShowErrors: true } },
    );

    const feedsResponse = apiClient.get<BackendFeed[]>(
      '/events/user_feeds',
      undefined,
      userData?.id !== PUBLIC_USER_ID,
    );

    const [featuresSettled, feedsSettled] = await Promise.allSettled([
      featuresResponse,
      feedsResponse,
    ]);

    let features: { [T in AppFeatureType]?: boolean } = {};
    if (
      featuresSettled.status === 'fulfilled' &&
      Array.isArray(featuresSettled.value)
    ) {
      featuresSettled.value.forEach((ft: BackendFeature) => {
        features[ft.name] = true;
      });
    } else if (featuresSettled.status === 'rejected') {
      console.error('Feature api call failed. Applying default features...');
      appConfig.featuresByDefault.reduce((acc, featName) => {
        acc[featName] = true;
        return acc;
      }, features);
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
      console.error('User feeds call failed. Applying default feed...');
      feeds = [{ feed: appConfig.defaultFeed, isDefault: true }];
    }

    // check features override from .env and .env.local files.
    // use it to enable/disable specific features for development
    if (import.meta.env.VITE_FEATURES_CONFIG) {
      try {
        const featuresOverride = JSON.parse(import.meta.env.VITE_FEATURES_CONFIG as string);
        if (featuresOverride) {
          features = {...features, ...featuresOverride};
        }
      } catch (e) {}
    }

    const udm = new UserDataModel({ features, feeds });
    return udm;
  },
  userResourceRequestParamsAtom,
  'userResourceAtom',
);
