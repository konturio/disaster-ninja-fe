import configRepo from '~core/config';

export type UserProfileMain = {
  username?: string;
  email?: string;
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

export type UserDto = UserProfileMain & UserProfileSettings;

export type CurrentUser = UserDto & {
  defaultLayers?: string[];
  loading?: boolean;
};

export const defaultUserProfileData: UserDto = {
  username: '',
  email: '',
  fullName: '',
  language: 'en',
  useMetricUnits: true,
  subscribedToKonturUpdates: false,
  bio: '',
  osmEditor: configRepo.get().osmEditors[0].id,
  defaultFeed: configRepo.get().defaultFeed,
  theme: 'kontur',
};

export const publicUser = {
  ...defaultUserProfileData,
};
