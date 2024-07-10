import { configRepo } from '~core/config';
import { LoginForm, SettingsForm } from '~features/user_profile';
import s from './Profile.module.css';

export function ProfilePage() {
  const user = configRepo.get().user;

  if (user)
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
