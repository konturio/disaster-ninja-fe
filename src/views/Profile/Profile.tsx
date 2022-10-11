import { Button, Input, Radio, Select, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { userStateAtom } from '~core/auth';
import { LoginForm } from '~features/user_profile';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { Textarea } from '~components/Textarea/Textarea';
import s from './Profile.module.css';
const authInputClasses = { input: clsx(s.authInput) };

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
        <div className={s.flexWrap}>
          <div className={s.profileWrap}>
            <Text type="heading-xl">Profile</Text>

            {/* Full Name */}
            <Input
              classes={authInputClasses}
              showTopPlaceholder
              value={'formData.email'}
              placeholder={i18n.t('profile.fullName')}
            />

            {/* Email */}
            <Input
              showTopPlaceholder
              value={''}
              onChange={() => {
                // noop
              }}
              placeholder={i18n.t('profile.email')}
              disabled
            />
            <div className={s.biography}>
              <Textarea placeholder="Bio" showTopPlaceholder />
            </div>

            <Button title="Logout" onClick={logout}>
              Logout
            </Button>
          </div>

          <div className={s.divider}></div>

          <div className={s.settingsWrap}>
            <Text type="heading-xl">Settings</Text>

            <Select
              placeholder={i18n.t('profile.interfaceTheme')}
              items={[
                { title: '1', value: 'ass' },
                { title: '2', value: 'ass2' },
              ]}
            />

            <Select
              placeholder={i18n.t('profile.interfaceLanguage')}
              value="ass2"
              items={[
                { title: '1', value: 'ass' },
                { title: '2', value: 'ass2' },
              ]}
            />

            <div className={s.unitsSelection}>
              <Text type="short-l">{i18n.t('profile.units')}</Text>

              <Radio as="input" id="bpoba" />
              <Radio as="input" id="ssss" />
            </div>

            <div className={s.settingsContent}></div>
          </div>
        </div>
      </div>
    );

  // Standart login form
  return (
    <div className={s.modeWrap}>
      <div className={s.loginWrap}>
        <LoginForm />
      </div>
    </div>
  );
}
