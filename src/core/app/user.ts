import { appConfig } from '~core/app_config';

export type CurrentUser = {
  id: string | null;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  language: string;
  useMetricUnits: boolean;
  subscribedToKonturUpdates: boolean;
  bio?: string;
  osmEditor: string;
  defaultFeed: string;
  theme: string;
  defaultLayers?: string[];
  loading?: boolean;
  token?: string;
};

export const defaultUserProfileData = {
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
