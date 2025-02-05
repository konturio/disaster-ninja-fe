export type UserDto = {
  username: string;
  email: string;
  fullName: string;
  bio: string;
  objectives: string;
  language: string;
  useMetricUnits: boolean;
  subscribedToKonturUpdates: boolean;
  osmEditor: string;
  defaultFeed: string;
  theme: string;
};

export type CurrentUser = UserDto & {
  defaultLayers?: string[];
  loading?: boolean;
};
