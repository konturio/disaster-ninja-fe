import { Button, Input, Radio, Select, Text, Textarea } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { flatObjectsAreEqual } from '~utils/common';
import { userResourceAtom } from '~core/auth';
import { currentProfileAtom, pageStatusAtom } from '../../atoms/userProfile';
import s from './SettingsForm.module.css';
import type { UserProfileState } from '../../atoms/userProfile';
import type { ChangeEvent } from 'react';

const authInputClasses = { input: clsx(s.authInput) };

export function SettingsForm() {
  const [userProfile, { updateUserProfile }] = useAtom(currentProfileAtom);
  const [localSettings, setLocalSettings] = useState<UserProfileState | null>(
    userProfile,
  );
  const [status, { set }] = useAtom(pageStatusAtom);
  const [{ data: userModel }] = useAtom(userResourceAtom);

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
      !flatObjectsAreEqual(localSettings, userProfile)
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
    // TODO that would be done in #12287
  }
  function toggleUnits() {
    setLocalSettings((prevSettings) => {
      return { ...prevSettings, useMetricUnits: !prevSettings?.useMetricUnits };
    });
  }
  function onFeedChange(e) {
    // TODO that would be done in #12290
  }
  function onOSMeditorChange(e) {
    // TODO that would be done in #12302
  }
  return (
    <>
      <div className={s.contentWrap}>
        <div className={s.notFlexParent}>
          <div className={s.flexWrap}>
            <div className={s.profileWrap}>
              <Text type="heading-xl">{i18n.t('profile.profileSettingsHeader')}</Text>

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
                placeholder={i18n.t('profile.email')}
                disabled
              />
              <div className={s.biography}>
                <Textarea
                  placeholder={i18n.t('profile.userBio(about)')}
                  showTopPlaceholder
                  value={localSettings?.bio}
                  onChange={onBioChange}
                  className={s.textArea}
                  width="100%"
                  minHeight="40px"
                />
              </div>
            </div>

            <div className={s.divider}></div>

            <div className={s.settingsWrap}>
              <Text type="heading-xl">{i18n.t('profile.appSettingsHeader')}</Text>

              <Select
                value={localSettings?.theme}
                alwaysShowPlaceholder
                items={[
                  { title: i18n.t('profile.konturTheme'), value: 'kontur' },
                  { title: i18n.t('profile.HOTTheme'), value: 'hot' },
                ]}
                withResetButton={false}
              >
                {i18n.t('profile.interfaceTheme')}
              </Select>

              <Select
                alwaysShowPlaceholder
                value={localSettings?.language}
                items={[
                  { title: i18n.t('profile.englishLanguageOption'), value: 'en' },
                  { title: i18n.t('profile.spanishLanguageOption'), value: 'es' },
                ]}
                withResetButton={false}
                onSelect={onLanguageChange}
              >
                {i18n.t('profile.interfaceLanguage')}
              </Select>

              <div className={s.unitsSelection}>
                <Text type="short-l">{i18n.t('profile.units')}</Text>

                <Radio
                  as="input"
                  id="metric"
                  label={i18n.t('profile.metric')}
                  checked={localSettings?.useMetricUnits}
                  onChange={toggleUnits}
                />
                <Radio
                  as="input"
                  id="imperial"
                  label={i18n.t('profile.imperialBeta')}
                  checked={!localSettings?.useMetricUnits}
                  onChange={toggleUnits}
                />
              </div>

              {/* disaster feed selector */}
              <Select
                alwaysShowPlaceholder
                value={localSettings?.defaultFeed || 'kontur-public'}
                items={[
                  { title: 'Kontur Public', value: 'kontur-public' },
                  { title: 'Kontur A', value: 'kontur-a' },
                  { title: 'Kontur B', value: 'kontur-b' },
                ]}
                withResetButton={false}
                onSelect={onFeedChange}
              >
                {i18n.t('profile.defaultDisasterFeed')}
              </Select>

              {/* OSMeditor selector */}
              <Select
                alwaysShowPlaceholder
                value={localSettings?.osmEditor || 'JOSM'}
                items={[
                  { title: 'JOSM', value: 'JOSM' },
                  { title: 'iD', value: 'iD' },
                  { title: 'RapiD', value: 'RapiD' },
                ]}
                withResetButton={false}
                onSelect={onOSMeditorChange}
              >
                {i18n.t('profile.defaultOSMeditor')}
              </Select>

              <div className={s.saveWrap}>
                {status === 'loading' ? (
                  <div className={s.spinnerContainer}>
                    <KonturSpinner />
                  </div>
                ) : (
                  <Button onClick={onSave} disabled={status === 'init'}>
                    <Text type="short-m">{i18n.t('profile.saveButton')}</Text>
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
    </>
  );
}
