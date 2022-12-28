import { createAtom } from '~utils/atoms';
import { appConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { currentUserAtom } from '~core/shared_state/currentUser';
import { UserDataModel } from '../models/UserDataModel';
import type {
  AppFeatureType,
  BackendFeature,
  BackendFeed,
  UserFeed,
} from '~core/auth/types';

type UserResourceRequestParams = {
  userId: string | null;
  appId: string;
};

const userResourceRequestParamsAtom = createAtom(
  {
    currentUserAtom,
  },
  (
    { get },
    state: UserResourceRequestParams = { userId: null, appId: appConfig.id },
  ): UserResourceRequestParams => {
    const userData = get('currentUserAtom');
    return {
      userId: userData.id,
      appId: appConfig.id,
    };
  },
  'userResourceRequestParamsAtom',
);

export const userResourceAtom = createAsyncAtom(
  userResourceRequestParamsAtom,
  async (params, abortController) => {
    const { userId, appId } = params;

    const featuresResponse = apiClient.get<BackendFeature[]>(
      `/features`,
      { appId },
      userId !== null,
      { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
    );

    let feedsResponse: Promise<BackendFeed[] | null>;
    // if user not logged in - avoid extra request for feed
    if (userId === null) {
      feedsResponse = (async () => [appConfig.defaultFeedObject])();
    } else {
      feedsResponse = apiClient.get<BackendFeed[]>('/events/user_feeds', undefined, true);
    }

    const [featuresSettled, feedsSettled] = await Promise.allSettled([
      featuresResponse,
      feedsResponse,
    ]);

    const features: { [T in AppFeatureType]?: boolean } = {};
    if (featuresSettled.status === 'fulfilled' && Array.isArray(featuresSettled.value)) {
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
      Array.isArray(feedsSettled.value) &&
      feedsSettled.value.length > 0
    ) {
      feeds = [...feedsSettled.value];
    } else if (feedsSettled.status === 'rejected') {
      console.error('User feeds call failed. Applying default feed...');
      feeds = [appConfig.defaultFeedObject];
    }

    const udm = new UserDataModel({ features, feeds });
    return udm;
  },
  'userResourceAtom',
);
