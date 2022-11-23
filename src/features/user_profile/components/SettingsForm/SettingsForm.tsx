import { Button, Input, Radio, Select, Text, Textarea } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import core from '~core/index';
import { flatObjectsAreEqual } from '~utils/common';
import { currentProfileAtom, pageStatusAtom } from '../../atoms/userProfile';
import s from './SettingsForm.module.css';
import type { ChangeEvent } from 'react';
import type { UserProfile } from '~core/current_user';

const authInputClasses = { input: clsx(s.authInput) };

export function SettingsForm() {
  const [userProfile, { updateUserProfile }] = useAtom(currentProfileAtom);
  const [localSettings, setLocalSettings] = useState<Partial<UserProfile> | null>(
    userProfile,
  );
  const [status, { set: setPageStatus }] = useAtom(pageStatusAtom);
  const [feeds] = useAtom(core.feeds.atom);

  function logout() {
    core.auth.logout();
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
      localSettings &&
      // TODO: replace it with lodash deepEqual
      // @ts-ignore 
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
    if (!localSettings) return;
    // do async put request
    // set loading state for it
    // put response to the currentProfileAtom
    updateUserProfile({ ...userProfile!, ...localSettings });
  }

  function onFullnameChange(e: ChangeEvent<HTMLInputElement>) {
    setLocalSettings((settings) => ({ ...settings, fullName: e.target.value }));
  }
  function onBioChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setLocalSettings((settings) => ({ ...settings, bio: e.target.value }));
  }

  function onThemeChange(e) {
    setLocalSettings((settings) => ({ ...settings, theme: e.value }));
  }
  function onLanguageChange(e) {
    setLocalSettings((settings) => ({ ...settings, language: e.value }));
  }
  function toggleUnits() {
    setLocalSettings((settings) => ({
      ...settings,
      useMetricUnits: !settings?.useMetricUnits,
    }));
  }

  function onFeedChange(e) {
    setLocalSettings((settings) => ({ ...settings, defaultFeed: e.value }));
  }

  function onOSMeditorChange(e) {
    setLocalSettings((settings) => ({ ...settings, osmEditor: e.value }));
  }

  const OPTIONS_THEME = [
    { title: core.i18n.t('profile.konturTheme'), value: 'kontur' },
    // { title: core.i18n.t('profile.HOTTheme'), value: 'hot' },
  ];
  const OPTIONS_LANGUAGE = [
    { title: core.i18n.t('profile.englishLanguageOption'), value: 'en' },
    { title: core.i18n.t('profile.spanishLanguageOption'), value: 'es' },
    { title: core.i18n.t('profile.arabicLanguageOption'), value: 'ar' },
  ];

  const OPTIONS_FEED = (feeds.data ?? []).map((o) => ({
    title: o.name,
    value: o.feed,
  }));

  const OPTIONS_OSM = core.app.config.osmEditors.map((o) => ({
    title: o.title,
    value: o.id,
  }));

  return (
    <>
      <div className={s.contentWrap}>
        <div className={s.notFlexParent}>
          <div className={s.flexWrap}>
            <div className={s.profileWrap}>
              <Text type="heading-xl">
                {core.i18n.t('profile.profileSettingsHeader')}
              </Text>

              {/* Full Name */}
              <Input
                classes={authInputClasses}
                showTopPlaceholder
                placeholder={core.i18n.t('profile.fullName')}
                value={localSettings.fullName}
                onChange={onFullnameChange}
              />

              {/* Email */}
              <Input
                showTopPlaceholder
                value={localSettings.email}
                placeholder={core.i18n.t('profile.email')}
                disabled
              />
              <div className={s.biography}>
                <Textarea
                  placeholder={core.i18n.t('profile.userBio(about)')}
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
              <Text type="heading-xl">{core.i18n.t('profile.appSettingsHeader')}</Text>
              <Select
                value={localSettings.theme}
                alwaysShowPlaceholder
                items={OPTIONS_THEME}
                withResetButton={false}
                onSelect={onThemeChange}
              >
                {core.i18n.t('profile.interfaceTheme')}
              </Select>

              <Select
                alwaysShowPlaceholder
                value={localSettings.language}
                items={OPTIONS_LANGUAGE}
                withResetButton={false}
                onSelect={onLanguageChange}
              >
                {core.i18n.t('profile.interfaceLanguage')}
              </Select>

              <div className={s.unitsSelection}>
                <Text type="short-l">{core.i18n.t('profile.units')}</Text>

                <Radio
                  as="input"
                  id="metric"
                  label={core.i18n.t('profile.metric')}
                  checked={localSettings.useMetricUnits}
                  onChange={toggleUnits}
                />
                <Radio
                  as="input"
                  id="imperial"
                  label={core.i18n.t('profile.imperialBeta')}
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
                {core.i18n.t('profile.defaultDisasterFeed')}
              </Select>

              <Select
                alwaysShowPlaceholder
                value={localSettings.osmEditor}
                items={OPTIONS_OSM}
                withResetButton={false}
                onSelect={onOSMeditorChange}
              >
                {core.i18n.t('profile.defaultOSMeditor')}
              </Select>

              <div className={s.saveWrap}>
                {status === 'loading' ? (
                  <div className={s.spinnerContainer}>
                    <KonturSpinner />
                  </div>
                ) : (
                  <Button onClick={onSave} disabled={status === 'init'}>
                    <Text type="short-m">{core.i18n.t('profile.saveButton')}</Text>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.logoutWrap}>
        <Button onClick={logout} variant="invert">
          <Text type="short-m">{core.i18n.t('logout')}</Text>
        </Button>
      </div>
    </>
  );
}
