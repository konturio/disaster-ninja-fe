import { useAtom } from '@reatom/react';
import { LoginButton } from '~features/user_profile';
import { userStateAtom } from '~core/auth/atoms/userState';
import { useCallback, useEffect, useState } from 'react';
import s from './UserProfile.module.css';
import { OptionType, Selector } from '@k2-packages/ui-kit/tslib/Selector';
import clsx from 'clsx';
import { authClient } from '~core/index';

const userMenu: OptionType[] = [
  {
    label: 'Logout',
    hint: 'Logout',
    value: 'logout',
  },
];

function UserAvatar() {
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);

  const onImgClick = () => {
    if (!isMenuShown) {
      setIsMenuShown(true);
    }
  };

  useEffect(() => {
    const onBackdropClick = () => {
      if (isMenuShown) {
        setIsMenuShown(false);
      }
    };

    document.body.addEventListener('click', onBackdropClick);

    return () => {
      document.body.removeEventListener('click', onBackdropClick);
    };
  });

  const onMenuSelect = useCallback((val: string) => {
    switch (val) {
      case 'logout':
        authClient.logout();
        break;
    }
  }, []);

  return (
    <>
      <div className={clsx(s.dropdownContainer, isMenuShown && s.show, !isMenuShown && s.hide)}>
        <Selector onChange={onMenuSelect} options={userMenu} />
      </div>
      <img onClick={onImgClick} src='assets/default-avatar.png' className={s.avatar} alt='user avatar' />
    </>
  )
}

export function UserProfile() {
  const [userState] = useAtom(userStateAtom);

  return userState === 'authorized' ? (
    <UserAvatar />
  ) : <LoginButton />;
}
