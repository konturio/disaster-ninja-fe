import { AppFeature } from '~core/auth/types';
import { LoginForm } from './components/LoginForm/LoginForm';
import { UserProfile } from './components/UserProfileButton/UserProfile';
import { LoginButton } from './components/LoginButton/LoginButton';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export { LoginForm, UserProfile, LoginButton };

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.APP_LOGIN,
  RootComponent: ({ reportReady }: { reportReady: () => void }) => {
    return <UserProfile reportReady={reportReady} />;
  },
};
