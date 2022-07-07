import { useAtom } from '@reatom/react';
import { useCallback, useEffect, useState } from 'react';
import { Selector } from '@konturio/ui-kit/tslib/Selector';
import clsx from 'clsx';
import { Button } from '@konturio/ui-kit';
import { User24 } from '@konturio/default-icons';
import { authClientInstance } from '~core/authClientInstance';
import { userStateAtom } from '~core/auth/atoms/userState';
import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';
import { LoginButton } from '../LoginButton/LoginButton';
import s from './UserProfile.module.css';
import type { OptionType } from '@konturio/ui-kit/tslib/Selector';

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
        authClientInstance.logout();
        break;
    }
  }, []);

  return (
    <>
      <div
        className={clsx(
          s.dropdownContainer,
          isMenuShown && s.show,
          !isMenuShown && s.hide,
        )}
      >
        <Selector onChange={onMenuSelect} options={userMenu} />
      </div>
      <Button
        onClick={onImgClick}
        dark
        variant="invert"
        size="small"
        transparent
        iconBefore={<User24 />}
      />
    </>
  );
}

let markedReady = false;

export function UserProfile() {
  const [userState] = useAtom(userStateAtom);

  if (!markedReady) {
    featureStatus.markReady(AppFeature.APP_LOGIN);
    markedReady = true;
  }
  return userState === 'authorized' ? <UserAvatar /> : <LoginButton />;
}
