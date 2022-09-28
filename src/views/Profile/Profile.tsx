import { Button } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { userStateAtom } from '~core/auth';
import { LoginForm } from '~features/user_profile';
import { authClientInstance } from '~core/authClientInstance';
import s from './Profile.module.css';

export function ProfileMode() {
  // login if no auth
  // Profile and Settings othervise
  const [userState] = useAtom(userStateAtom);
  function logout() {
    authClientInstance.logout();
  }

  if (userState === 'authorized')
    return (
      <div className={s.modeWrap}>
        <div className={s.profileWrap}>
          <Button title="Logout" onClick={logout}>
            Logout
          </Button>
        </div>
        <div className={s.settingsWrap}></div>
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
