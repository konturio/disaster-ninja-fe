import { Button, Input, Radio, Select, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { userStateAtom } from '~core/auth';
import { LoginForm } from '~features/user_profile';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
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
        <div className={s.flexWrap}>
          <div className={s.profileWrap}>
            <Text type="heading-xl">Profile</Text>

            {/* Full Name */}
            <Input
              error={i18n.t('profile.fullNameError')}
              showTopPlaceholder
              value={''}
              onChange={() => {
                // noop
              }}
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

            <textarea placeholder="Bio" className={s.biography}></textarea>

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
