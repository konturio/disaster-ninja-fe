import { useAtom } from '@reatom/react';
import { LoginButton } from '~features/user_profile';
import s from './UserProfile.module.css';
import { userStateAtom } from '~core/auth/atoms/userState';

function UserAvatar() {
  return <img src='assets/default-avatar.png' className={s.avatar} alt='user avatar' />
}

export function UserProfile() {
  const [userState] = useAtom(userStateAtom);

  return userState === 'authorized' ? (
    <UserAvatar />
  ) : <LoginButton />;
}
