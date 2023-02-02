import { appConfig } from '~core/app_config';

export type UserProfileMain = {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  bio?: string;
};

export type UserProfileSettings = {
  language: string;
  useMetricUnits: boolean;
  subscribedToKonturUpdates: boolean;
  osmEditor: string;
  defaultFeed: string;
  theme: string;
};

export type UserProfileApi = UserProfileMain & UserProfileSettings;

export type CurrentUser = UserProfileApi & {
  id: string | null;
  defaultLayers?: string[];
  loading?: boolean;
  token?: string;
};

export const defaultUserProfileData: UserProfileApi = {
  username: '',
  email: '',
  fullName: '',
  language: 'en',
  useMetricUnits: true,
  subscribedToKonturUpdates: false,
  bio: '',
  osmEditor: appConfig.osmEditors[0].id,
  defaultFeed: appConfig.defaultFeedObject.feed,
  theme: 'kontur',
};

export const publicUser = {
  ...defaultUserProfileData,
  // id===null means PUBLIC USER
  id: null,
};
