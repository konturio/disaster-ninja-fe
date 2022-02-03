import { useAtom } from '@reatom/react';
import { LoginButton } from '~features/user_profile';
import s from './UserProfile.module.css';
import { currentUserAtom } from '~core/shared_state';

function UserAvatar() {
  return <img src='assets/default-avatar.png' className={s.avatar} alt='user avatar' />
}

export function UserProfile() {
  const [currentUser] = useAtom(currentUserAtom);

  return currentUser.userState === 'authorized' ? (
    <UserAvatar />
  ) : <LoginButton />;
}
