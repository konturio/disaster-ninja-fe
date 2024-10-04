import { Button, Input, Radio, Select, Text, Heading, Textarea } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { lazily } from 'react-lazily';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state/featureFlags';
import { flatObjectsAreEqual } from '~utils/common';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import { DEFAULT_OSM_EDITOR } from '~core/constants';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { currentProfileAtom, pageStatusAtom } from '../../atoms/userProfile';
import s from './SettingsForm.module.css';
import type { UserDto } from '~core/app/user';

const { ReferenceAreaInfo } = lazily(
  () => import('./ReferenceAreaInfo/ReferenceAreaInfo'),
);
const { SelectFeeds } = lazily(() => import('./SelectFeeds'));

const authInputClasses = { input: clsx(s.authInput) };

export function SettingsForm() {
  const [user, { getUserProfile, updateUserProfile }] = useAtom(currentProfileAtom);
  const [status] = useAtom(pageStatusAtom);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

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
  const [isBioTooltipOpen, setIsBioTooltipOpen] = useState(false);
  const featureFlags = configRepo.get().features;
  const bioRef = useRef<HTMLDivElement | null>(null);

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
  }, [localSettings, setPageStatus, userProfile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bioRef.current && !bioRef.current.contains(event.target as Node)) {
        setIsBioTooltipOpen(false);
      }
    }

    if (isBioTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBioTooltipOpen]);

  function onTextAreaClick() {
    setIsBioTooltipOpen((prev) => !prev);
  }

  function onSave() {
    dispatchMetricsEvent('profile_save');
    // do async put request
    // set loading state for it
    // put response to the currentProfileAtom
    updateUserProfile(localSettings);
  }

  function onChange(key: string) {
    return (e) => {
      if (key === 'language') dispatchMetricsEvent('language_change');
      if (key === 'bio') dispatchMetricsEvent('bio_fill');
      setLocalSettings({ ...localSettings, [key]: e.target?.value ?? e.value });
    };
  }

  function toggleUnits() {
    setLocalSettings((prevSettings) => {
      return { ...prevSettings, useMetricUnits: !prevSettings?.useMetricUnits };
    });
  }

  const OPTIONS_THEME = [
    { title: i18n.t('profile.konturTheme'), value: 'kontur' },
    // { title: i18n.t('profile.HOTTheme'), value: 'hot' },
  ];

  const OPTIONS_LANGUAGE = getLanguageOptions();

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
                  onChange={onChange('fullName')}
                />

                <Input
                  showTopPlaceholder
                  value={localSettings.email}
                  placeholder={i18n.t('profile.email')}
                  disabled
                />
                <Tooltip placement="right-start" open={isBioTooltipOpen} offset={4}>
                  <TooltipTrigger>
                    <div
                      className={s.biography}
                      ref={bioRef}
                      onMouseDown={onTextAreaClick}
                      onFocus={() => setIsBioTooltipOpen(true)}
                      onBlur={() => setIsBioTooltipOpen(false)}
                    >
                      <Textarea
                        placeholder={i18n.t('profile.user_bio_placeholder')}
                        showTopPlaceholder
                        value={localSettings.bio}
                        onChange={onChange('bio')}
                        className={s.textArea}
                        width="100%"
                        minHeight="250px"
                        maxHeight="400px"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className={s.bioTooltipContent}>
                      {i18n.t('profile.user_bio_tooltip')}
                    </div>
                  </TooltipContent>
                </Tooltip>

                {featureFlags?.[FeatureFlag.REFERENCE_AREA] && (
                  <div>
                    <Text type="short-l" className={s.smallTitle}>
                      {i18n.t('profile.reference_area.title')}
                    </Text>
                    <ReferenceAreaInfo />
                  </div>
                )}
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
                  onSelect={onChange('theme')}
                >
                  {i18n.t('profile.interfaceTheme')}
                </Select>

                <Select
                  alwaysShowPlaceholder
                  value={localSettings.language}
                  items={OPTIONS_LANGUAGE}
                  withResetButton={false}
                  onSelect={onChange('language')}
                >
                  {i18n.t('profile.interfaceLanguage')}
                </Select>

                <div>
                  <Text type="short-l" className={s.smallTitle}>
                    {i18n.t('profile.units')}
                  </Text>

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

                {(featureFlags[FeatureFlag.FEED_SELECTOR] ||
                  featureFlags[FeatureFlag.EVENTS_LIST__FEED_SELECTOR]) && (
                  <SelectFeeds
                    onChange={onChange('defaultFeed')}
                    value={localSettings.defaultFeed}
                    title={i18n.t('profile.defaultDisasterFeed')}
                  />
                )}

                <Select
                  data-testid="osmEditor"
                  alwaysShowPlaceholder
                  value={localSettings.osmEditor || DEFAULT_OSM_EDITOR}
                  items={OPTIONS_OSM}
                  withResetButton={false}
                  onSelect={onChange('osmEditor')}
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
