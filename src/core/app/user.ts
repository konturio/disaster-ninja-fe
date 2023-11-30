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
