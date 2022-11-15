import { useAtom } from '@reatom/react';
import { userStateAtom } from '~core/auth';
import { LoginForm } from '~features/user_profile';
import { SettingsForm } from '~features/user_profile/components/SettingsForm/SettingsForm';
import s from './Profile.module.css';

export function ProfilePage() {
  const [userState] = useAtom(userStateAtom);

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
