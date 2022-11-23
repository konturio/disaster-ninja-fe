import { useAtom } from '@reatom/react';
import core from '~core/index';
import { LoginForm } from '~features/user_profile';
import { SettingsForm } from '~features/user_profile/components/SettingsForm/SettingsForm';
import s from './Profile.module.css';

export function ProfilePage() {
  const [userState] = useAtom(core.auth.atom);

  if (userState === 'authorized')
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
