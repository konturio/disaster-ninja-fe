import { useAtom } from '@reatom/react-v2';
import { userStateAtom } from '~core/auth';
import { LoginForm, SettingsForm } from '~features/user_profile';
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
