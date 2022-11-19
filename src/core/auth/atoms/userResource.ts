import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state/currentUser';
import { currentApplicationAtom } from '~core/shared_state/currentApplication';
import core from '~core/index';
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
  applicationId: string;
} | null;

const userResourceRequestParamsAtom = createAtom(
  {
    currentUserAtom,
    currentApplicationAtom,
  },
  ({ get }, state: UserResourceRequestParams = null): UserResourceRequestParams => {
    const applicationId = get('currentApplicationAtom');
    const userData = get('currentUserAtom');
    if (!applicationId) return null;
    return {
      userData,
      applicationId,
    };
  },
  'userResourceRequestParamsAtom',
);

export const userResourceAtom = createAsyncAtom(
  userResourceRequestParamsAtom,
  async (params, abortController) => {
    const { userData, applicationId } = params;

    const featuresResponse = core.api.apiClient.get<BackendFeature[]>(
      `/features`,
      { appId: applicationId },
      userData?.id !== PUBLIC_USER_ID,
      { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
    );

    let feedsResponse: Promise<BackendFeed[] | null>;
    // if user not logged in - avoid extra request for feed
    if (userData?.id === PUBLIC_USER_ID) {
      feedsResponse = (async () => [core.config.defaultFeedObject])();
    } else {
      feedsResponse = core.api.apiClient.get<BackendFeed[]>(
        '/events/user_feeds',
        undefined,
        true,
      );
    }

    const [featuresSettled, feedsSettled] = await Promise.allSettled([
      featuresResponse,
      feedsResponse,
    ]);

    let features: { [T in AppFeatureType]?: boolean } = {};
    if (featuresSettled.status === 'fulfilled' && Array.isArray(featuresSettled.value)) {
      featuresSettled.value.forEach((ft: BackendFeature) => {
        features[ft.name] = true;
      });
    } else if (featuresSettled.status === 'rejected') {
      console.error('Feature api call failed. Applying default features...');
      core.config.featuresByDefault.reduce((acc, featName) => {
        acc[featName] = true;
        return acc;
      }, features);
    }

    let feeds: UserFeed[] | null = null;
    if (
      feedsSettled.status === 'fulfilled' &&
      Array.isArray(feedsSettled.value) &&
      feedsSettled.value.length > 0
    ) {
      feeds = [...feedsSettled.value];
    } else if (feedsSettled.status === 'rejected') {
      console.error('User feeds call failed. Applying default feed...');
      feeds = [core.config.defaultFeedObject];
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
);
