import { useAtom } from '@reatom/react';
import { currentUserAtom } from '~core/auth';
import { LoginButton } from '~features/user_profile';
import s from './UserProfile.module.css';

function UserAvatar() {
  return <img src='assets/default-avatar.png' className={s.avatar} alt='user avatar' />
}

export function UserProfile() {
  const [currentUser] = useAtom(currentUserAtom);

  return currentUser.userState === 'authorized' ? (
    <UserAvatar />
  ) : <LoginButton />;
}
