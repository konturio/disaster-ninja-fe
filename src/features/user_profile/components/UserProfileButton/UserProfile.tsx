import { useAtom } from '@reatom/react';
import { LoginButton } from '~features/user_profile';
import { userStateAtom } from '~core/auth/atoms/userState';
import { useCallback } from 'react';
import s from './UserProfile.module.css';
import { OptionType, Selector } from '@k2-packages/ui-kit/tslib/Selector';

const userMenu: OptionType[] = [
  {
    label: 'Foo',
    hint: 'This is foo',
    value: 'foo',
  },
  {
    label: 'Bar',
    hint: 'This is bar',
    value: 'bar',
  },
  {
    label: 'Baz',
    hint: 'This is baz',
    value: 'baz',
  },
  {
    label: 'Disabled',
    hint: 'This is disabled',
    value: 'disabled',
    disabled: true,
  },
];

function UserAvatar() {
  const onImgClick = useCallback(() => {

  }, []);

  return (
    <>
      <div className={s.dropdownContainer}>
        <Selector onChange={console.log} options={userMenu} selected={'foo'} />
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
