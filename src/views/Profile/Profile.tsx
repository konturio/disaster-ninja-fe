import { Button, Input, Radio, Select, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import i18nLibrary from 'i18next';
import { userStateAtom } from '~core/auth';
import { LoginForm } from '~features/user_profile';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { Textarea } from '~components/Textarea/Textarea';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { simpleObjectsAreEqual } from '~utils/common';
import s from './Profile.module.css';
import {
  currentProfileAtom,
  pageStatusAtom
} from './atoms/userProfile';
import type {
  UserProfileState} from './atoms/userProfile';
import type { ChangeEvent} from 'react';
const authInputClasses = { input: clsx(s.authInput) };

export function ProfileMode() {
  // login if no auth
  // Profile and Settings othervise
  const [userState] = useAtom(userStateAtom);
  const [userProfile, { updateUserProfile }] = useAtom(currentProfileAtom);
  const [localSettings, setLocalSettings] = useState<UserProfileState | null>(
    userProfile,
  );
  const [status, { set }] = useAtom(pageStatusAtom);

  function logout() {
    authClientInstance.logout();
  }

  function onSave() {
    // do async put request
    // set loading state for it
    // put response to the currentProfileAtom
    updateUserProfile(localSettings || {});
  }

  // apply userProfile incoming settings to local settings
  useEffect(() => {
    userProfile && setLocalSettings({ ...userProfile });
  }, [userProfile, setLocalSettings]);

  useEffect(() => {
    // compare objects instead
    if (
      localSettings &&
      userProfile &&
      !simpleObjectsAreEqual(localSettings, userProfile)
    ) {
      set('changed');
    } else if (localSettings && userProfile) {
      set('init');
    }
  }, [localSettings, userProfile]);

  function onFullnameChange(e: ChangeEvent<HTMLInputElement>) {
    setLocalSettings({ ...localSettings, fullName: e.target.value });
  }
  function onBioChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setLocalSettings({ ...localSettings, bio: e.target.value });
  }
  function onLanguageChange(e) {
    i18nLibrary.changeLanguage(e.value);
  }

  if (userState === 'authorized')
    return (
      <div className={s.modeWrap}>
        <div className={s.contentWrap}>
          <div className={s.notFlexParent}>
            <div className={s.flexWrap}>
              <div className={s.profileWrap}>
                <Text type="heading-xl">Profile</Text>

                {/* Full Name */}
                <Input
                  classes={authInputClasses}
                  showTopPlaceholder
                  placeholder={i18n.t('profile.fullName')}
                  value={localSettings?.fullName}
                  onChange={onFullnameChange}
                />

                {/* Email */}
                <Input
                  showTopPlaceholder
                  value={localSettings?.email}
                  onChange={() => {
                    // noop
                  }}
                  placeholder={i18n.t('profile.email')}
                  disabled
                />
                <div className={s.biography}>
                  <Textarea
                    placeholder="Bio"
                    showTopPlaceholder
                    value={localSettings?.bio}
                    onChange={onBioChange}
                  />
                </div>
              </div>

              <div className={s.divider}></div>

              <div className={s.settingsWrap}>
                <Text type="heading-xl">Settings</Text>

                <Select
                  value={localSettings?.theme}
                  placeholder={i18n.t('profile.interfaceTheme')}
                  items={[
                    { title: 'Kontur', value: 'kontur' },
                    { title: 'HOT', value: 'hot' },
                  ]}
                  withResetButton={false}
                />

                <Select
                  placeholder={i18n.t('profile.interfaceLanguage')}
                  value={localSettings?.language}
                  items={[
                    { title: 'English', value: 'en' },
                    { title: 'Spanish', value: 'es' },
                  ]}
                  withResetButton={false}
                  onSelect={onLanguageChange}
                />

                <div className={s.unitsSelection}>
                  <Text type="short-l">{i18n.t('profile.units')}</Text>

                  <Radio as="input" id="bpoba" label={i18n.t('profile.metric')} />
                  <Radio as="input" id="ssss" label={i18n.t('profile.imperialBeta')} />
                </div>

                <div className={s.saveWrap}>
                  {status === 'loading' ? (
                    <div className={s.spinnerContainer}>
                      <KonturSpinner />
                    </div>
                  ) : (
                    <Button onClick={onSave} disabled={status === 'init'}>
                      <Text type="short-m">Save</Text>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.logoutWrap}>
          <Button onClick={logout} variant="invert">
            <Text type="short-m">Logout</Text>
          </Button>
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
