import { apiClient } from '~core/apiClientInstance';
import { createAtom, createResourceAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state/currentUser';
import { currentApplicationAtom } from '~core/shared_state/currentApplication';
import appConfig from '~core/app_config';
import { PUBLIC_USER_ID } from '~core/auth/constants';
import { UserDataModel } from '../models/UserDataModel';
import type {
  AppFeatureType,
  BackendFeature,
  BackendFeed,
  UserFeed,
} from '~core/auth/types';
import type { CurrentUser } from '~core/shared_state/currentUser';

type UserResourceRequestParams = {
  userData?: CurrentUser;
  applicationId?: string | null;
} | null;

const userResourceRequestParamsAtom = createAtom(
  {
    currentUserAtom,
    currentApplicationAtom,
  },
  (
    { get },
    state: UserResourceRequestParams = null,
  ): UserResourceRequestParams => {
    const applicationId = get('currentApplicationAtom');
    const userData = get('currentUserAtom');

    return {
      userData,
      applicationId,
    };
  },
  'userResourceRequestParamsAtom',
);

export const userResourceAtom = createResourceAtom<
  UserResourceRequestParams,
  UserDataModel | undefined
>(
  async (params) => {
    if (!params?.applicationId) return;
    const { userData, applicationId } = params;

    const featuresResponse = apiClient.get<BackendFeature[]>(
      `/features`,
      { appId: applicationId },
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
        const featuresOverride = JSON.parse(
          import.meta.env.VITE_FEATURES_CONFIG as string,
        );
        if (featuresOverride) {
          features = { ...features, ...featuresOverride };
        }
      } catch (e) {}
    }

    const udm = new UserDataModel({ features, feeds });
    return udm;
  },
  'userResourceAtom',
  userResourceRequestParamsAtom,
);
