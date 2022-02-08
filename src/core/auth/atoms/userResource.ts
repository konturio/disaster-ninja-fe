import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { CurrentUser, currentUserAtom } from '~core/shared_state/currentUser';
import { UserDataModel } from '~core/auth';
import { AppFeature } from '~core/auth/models/UserDataModel';

export const userResourceAtom = createResourceAtom<CurrentUser, UserDataModel | undefined>(
  currentUserAtom,
  async (userData) => {
    // TODO: Remove full address when Userprofile API service will be moved to the main app API
    const featuresResponse = apiClient.get<unknown>( 'https://test-apps02.konturlabs.com/userprofile/features', undefined, userData?.id !== 'public');
    const feedsResponse = apiClient.get<unknown>( '/events/user_feeds', undefined, userData?.id !== 'public');

    const data = await Promise.all([featuresResponse, feedsResponse]);

    if (!data || !data[0] || !data[1]) {
      throw new Error('No user data received');
    }

    const features: {[T in AppFeature]?: boolean } = {};
    if (Array.isArray(data[0])) {
      data[0].forEach((ft: { name: AppFeature }) => {
        features[ft.name] = true;
      })
    }

    let feeds: string[] = [];
    if (Array.isArray(data[1])) {
      feeds = data[1].map((fd: { feed: string }) => fd.feed );
    }

    const udm = new UserDataModel();
    Object.assign(udm, { features, feeds });

    return udm;
  },
  'userResourceAtom',
);
