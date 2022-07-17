import { AppFeature } from '~core/auth/types';
import { LoginForm } from './components/LoginForm/LoginForm';
import { UserProfile } from './components/UserProfileButton/UserProfile';
import { LoginButton } from './components/LoginButton/LoginButton';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

export { LoginForm, LoginButton };

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.APP_LOGIN,
  rootComponentWrap: (reportReady: () => void) => () => {
    return <UserProfile reportReady={reportReady} />;
  },
};
