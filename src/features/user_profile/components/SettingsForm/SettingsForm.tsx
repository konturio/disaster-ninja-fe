import { Button, Input, Radio, Select, Text, Textarea } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { flatObjectsAreEqual } from '~utils/common';
import { userResourceAtom } from '~core/auth';
import appConfig from '~core/app_config';
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
  const [status, { set: setPageStatus }] = useAtom(pageStatusAtom);
  const [{ data: userModel }] = useAtom(userResourceAtom);

  function logout() {
    authClientInstance.logout();
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
      setPageStatus('changed');
    } else if (localSettings && userProfile) {
      setPageStatus('init');
    }
  }, [localSettings, userProfile]);

  if (!localSettings)
    return (
      <div className={s.spinnerContainer}>
        <KonturSpinner />
      </div>
    );

  function onSave() {
    // do async put request
    // set loading state for it
    // put response to the currentProfileAtom
    updateUserProfile(localSettings || {});
  }

  function onFullnameChange(e: ChangeEvent<HTMLInputElement>) {
    setLocalSettings({ ...localSettings, fullName: e.target.value });
  }
  function onBioChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setLocalSettings({ ...localSettings, bio: e.target.value });
  }

  function onThemeChange(e) {
    setLocalSettings({ ...localSettings, theme: e.value });
  }
  function onLanguageChange(e) {
    setLocalSettings({ ...localSettings, language: e.value });
  }
  function toggleUnits() {
    setLocalSettings((prevSettings) => {
      return { ...prevSettings, useMetricUnits: !prevSettings?.useMetricUnits };
    });
  }

  function onFeedChange(e) {
    setLocalSettings({ ...localSettings, defaultFeed: e.value });
  }

  function onOSMeditorChange(e) {
    setLocalSettings({ ...localSettings, osmEditor: e.value });
  }

  const OPTIONS_THEME = [
    { title: i18n.t('profile.konturTheme'), value: 'kontur' },
    // { title: i18n.t('profile.HOTTheme'), value: 'hot' },
  ];
  const OPTIONS_LANGUAGE = [
    { title: i18n.t('profile.englishLanguageOption'), value: 'en' },
    { title: i18n.t('profile.spanishLanguageOption'), value: 'es' },
    { title: i18n.t('profile.arabicLanguageOption'), value: 'ar' },
    { title: i18n.t('profile.koreanLanguageOption'), value: 'ko' },
    { title: i18n.t('profile.indonesianLanguageOption'), value: 'id' },
    { title: i18n.t('profile.germanLanguageOption'), value: 'de' },
  ];

  const OPTIONS_FEED = (userModel?.feeds || [appConfig.defaultFeedObject]).map((o) => ({
    title: o.name,
    value: o.feed,
  }));

  const OPTIONS_OSM = appConfig.osmEditors.map((o) => ({
    title: o.title,
    value: o.id,
  }));

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
                value={localSettings.fullName}
                onChange={onFullnameChange}
              />

              {/* Email */}
              <Input
                showTopPlaceholder
                value={localSettings.email}
                placeholder={i18n.t('profile.email')}
                disabled
              />
              <div className={s.biography}>
                <Textarea
                  placeholder={i18n.t('profile.userBio(about)')}
                  showTopPlaceholder
                  value={localSettings.bio}
                  onChange={onBioChange}
                  className={s.textArea}
                  width="100%"
                  minHeight="80px"
                  maxHeight="200px"
                />
              </div>
            </div>

            <div className={s.divider} />

            <div className={s.settingsWrap}>
              <Text type="heading-xl">{i18n.t('profile.appSettingsHeader')}</Text>
              <Select
                value={localSettings.theme}
                alwaysShowPlaceholder
                items={OPTIONS_THEME}
                withResetButton={false}
                onSelect={onThemeChange}
              >
                {i18n.t('profile.interfaceTheme')}
              </Select>

              <Select
                alwaysShowPlaceholder
                value={localSettings.language}
                items={OPTIONS_LANGUAGE}
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
                  checked={localSettings.useMetricUnits}
                  onChange={toggleUnits}
                />
                <Radio
                  as="input"
                  id="imperial"
                  label={i18n.t('profile.imperialBeta')}
                  checked={!localSettings.useMetricUnits}
                  onChange={toggleUnits}
                />
              </div>

              <Select
                alwaysShowPlaceholder
                value={localSettings.defaultFeed}
                items={OPTIONS_FEED}
                withResetButton={false}
                onSelect={onFeedChange}
              >
                {i18n.t('profile.defaultDisasterFeed')}
              </Select>

              <Select
                alwaysShowPlaceholder
                value={localSettings.osmEditor}
                items={OPTIONS_OSM}
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
          <Text type="short-m">{i18n.t('logout')}</Text>
        </Button>
      </div>
    </>
  );
}
