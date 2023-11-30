import { Button, Input, Radio, Select, Text, Heading, Textarea } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { eventFeedsAtom } from '~core/shared_state';
import { flatObjectsAreEqual } from '~utils/common';
import { currentProfileAtom, pageStatusAtom } from '../../atoms/userProfile';
import s from './SettingsForm.module.css';
import type { UserDto } from '~core/app/user';
import type { ChangeEvent } from 'react';

const authInputClasses = { input: clsx(s.authInput) };

export function SettingsForm() {
  const [user, { getUserProfile, updateUserProfile }] = useAtom(currentProfileAtom);
  const [status] = useAtom(pageStatusAtom);

  useEffect(() => {
    getUserProfile();
  }, []);

  if (status === 'init')
    return (
      <div className={s.spinnerContainer}>
        <KonturSpinner />
      </div>
    );

  return <SettingsFormGen userProfile={user} updateUserProfile={updateUserProfile} />;
}

function SettingsFormGen({ userProfile, updateUserProfile }) {
  const [localSettings, setLocalSettings] = useState<UserDto>(userProfile);
  const [status, { set: setPageStatus }] = useAtom(pageStatusAtom);
  const [eventFeeds] = useAtom(eventFeedsAtom);

  function logout() {
    authClientInstance.logout();
  }

  useEffect(() => {
    // compare objects instead
    if (
      localSettings &&
      userProfile &&
      !flatObjectsAreEqual(localSettings, userProfile)
    ) {
      setPageStatus('changed');
    } else if (localSettings && userProfile) {
      setPageStatus('ready');
    }
  }, [localSettings, userProfile]);

  function onSave() {
    // do async put request
    // set loading state for it
    // put response to the currentProfileAtom
    updateUserProfile(localSettings);
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

  const OPTIONS_LANGUAGE = getLanguageOptions();

  const OPTIONS_FEED = eventFeeds.map((o) => ({
    title: o.name,
    value: o.feed,
  }));

  const OPTIONS_OSM = configRepo.get().osmEditors.map((o) => ({
    title: o.title,
    value: o.id,
  }));

  return (
    <>
      <div className={s.contentWrap}>
        <div className={s.notFlexParent}>
          <div className={s.flexWrap}>
            <div className={s.profileWrap}>
              <Heading type="heading-01">
                {i18n.t('profile.profileSettingsHeader')}
              </Heading>
              <div className={s.profileForm}>
                <Input
                  classes={authInputClasses}
                  showTopPlaceholder
                  placeholder={i18n.t('profile.fullName')}
                  value={localSettings.fullName}
                  onChange={onFullnameChange}
                />

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
            </div>

            <div className={s.divider} />

            <div className={s.settingsWrap}>
              <Heading type="heading-01">{i18n.t('profile.appSettingsHeader')}</Heading>
              <div className={s.settingsForm}>
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

                <div>
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
                    <Button onClick={onSave} disabled={status !== 'changed'}>
                      <Text type="short-m">{i18n.t('profile.saveButton')}</Text>
                    </Button>
                  )}
                </div>
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

const LANGUAGES = ['en', 'es', 'ar', 'ko', 'id', 'de', 'uk'] as const;
type Lng = (typeof LANGUAGES)[number];

const getLanguageOptions = () =>
  [...LANGUAGES].sort().map((lng) => {
    const [currentTranslation, destinationTranslation] = getLocaleTranslations(lng);

    return {
      title:
        lng === i18n.instance.language
          ? currentTranslation
          : `${currentTranslation} - ${destinationTranslation}`,
      value: lng,
    };
  });

const getLocaleTranslations = (lng: Lng): [string, string] => {
  switch (lng) {
    case 'en':
      return [
        i18n.t('profile.languageOption.en'),
        i18n.t('profile.languageOption.en', { lng }),
      ];
    case 'es':
      return [
        i18n.t('profile.languageOption.es'),
        i18n.t('profile.languageOption.es', { lng }),
      ];
    case 'ar':
      return [
        i18n.t('profile.languageOption.ar'),
        i18n.t('profile.languageOption.ar', { lng }),
      ];
    case 'ko':
      return [
        i18n.t('profile.languageOption.ko'),
        i18n.t('profile.languageOption.ko', { lng }),
      ];
    case 'id':
      return [
        i18n.t('profile.languageOption.id'),
        i18n.t('profile.languageOption.id', { lng }),
      ];
    case 'de':
      return [
        i18n.t('profile.languageOption.de'),
        i18n.t('profile.languageOption.de', { lng }),
      ];
    case 'uk':
      return [
        i18n.t('profile.languageOption.uk'),
        i18n.t('profile.languageOption.uk', { lng }),
      ];
  }
};
