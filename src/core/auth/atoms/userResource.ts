import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { CurrentUser, currentUserAtom } from '~core/shared_state/currentUser';
import { UserDataModel } from '~core/auth';
import { AppFeature, UserFeed } from '~core/auth/models/UserDataModel';
import config from '~core/app_config';

export const userResourceAtom = createResourceAtom<
  CurrentUser,
  UserDataModel | undefined
>(
  currentUserAtom,
  async (userData) => {
    // TODO: Remove full address when Userprofile API service will be moved to the main app API
    const featuresResponse = apiClient.get<unknown>(
      config.featuresApi,
      undefined,
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
      feeds = data[1].map((fd: { feed: string, default: boolean }) => ({
        feed: fd.feed,
        isDefault: fd.default
      })
      );
    }

    const udm = new UserDataModel();
    Object.assign(udm, { features, feeds });

    return udm;
  },
  'userResourceAtom',
);
