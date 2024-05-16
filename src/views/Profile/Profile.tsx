import { isAuthenticated } from '~core/auth/state';
import { LoginForm, SettingsForm } from '~features/user_profile';
import s from './Profile.module.css';

export function ProfilePage() {
  if (isAuthenticated())
    return (
      <div className={s.modeWrap}>
        <SettingsForm />
      </div>
    );

  return (
    <div className={s.modeWrap}>
      <div className={s.loginWrap}>
        <LoginForm />
      </div>
    </div>
  );
}
