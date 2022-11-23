export interface UserProfilesResponse {
  id: string;
  defaultLayers?: string[];
  username?: string;
  email?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  language?: string;
  useMetricUnits?: boolean;
  subscribedToKonturUpdates?: boolean;
  bio?: string;
  osmEditor?: string;
  defaultFeed?: string;
  theme?: string;
}

export interface UserProfile {
  id: string;
  defaultLayers?: string[];
  username?: string;
  email?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  language?: string;
  useMetricUnits?: boolean;
  subscribedToKonturUpdates?: boolean;
  bio?: string;
  osmEditor?: string;
  defaultFeed?: string;
  theme?: string;
}