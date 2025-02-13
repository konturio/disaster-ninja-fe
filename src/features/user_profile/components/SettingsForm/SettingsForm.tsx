import { Button, Input, Radio, Select, Text, Heading, Textarea } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { lazily } from 'react-lazily';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { flatObjectsAreEqual } from '~utils/common';
import { DEFAULT_OSM_EDITOR } from '~core/constants';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { AppFeature } from '~core/app/types';
import {
  GIS_SPECIALISTS,
  OPTIONS_LANGUAGE,
  OPTIONS_OSM,
} from '~features/user_profile/components/SettingsForm/constants';
import { SettingsNavigation } from '~features/user_profile/components/SettingsForm/SettingsNavigation/SettingsNavigation';
import { SettingsSection } from '~features/user_profile/components/SettingsForm/SettingsSection/SettingsSection';
import stylesV1 from '~features/user_profile/components/SettingsForm/SettingsForm.module.css';
import { FullScreenLoader } from '~components/LoadingSpinner/LoadingSpinner';
import { currentProfileAtom, pageStatusAtom } from '../../atoms/userProfile';
import s from './SettingsForm.module.css';
import type { LoginFeatureConfig } from '~core/config/types';

const { ReferenceAreaInfo } = lazily(
  () => import('./ReferenceAreaInfo/ReferenceAreaInfo'),
);
const { SelectFeeds } = lazily(() => import('./SelectFeeds'));

const authInputClasses = { input: clsx(s.authInput) };
const featureFlags = configRepo.get().features;
const loginPageConfig = featureFlags?.[AppFeature.APP_LOGIN];
const profileConfig =
  loginPageConfig && typeof loginPageConfig === 'object'
    ? (loginPageConfig as LoginFeatureConfig).profile_form
    : null;

const navigationSteps = [
  featureFlags?.[AppFeature.LLM_ANALYTICS] && {
    label: i18n.t('profile.analysis_objectives'),
    id: 'analysis-objectives',
  },
  featureFlags?.[AppFeature.REFERENCE_AREA] && {
    label: i18n.t('profile.reference_area.title'),
    id: 'reference-area',
  },
  { label: i18n.t('profile.your_contacts'), id: 'your-contacts' },
  profileConfig?.organization_section !== false && {
    label: i18n.t('profile.your_organization'),
    id: 'your-organization',
  },
  { label: i18n.t('profile.appSettingsHeader'), id: 'settings' },
].filter(Boolean);

export function SettingsForm() {
  const [user, { getUserProfile, updateUserProfile }] = useAtom(currentProfileAtom);
  const [status] = useAtom(pageStatusAtom);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  if (status === 'init') return <FullScreenLoader />;

  return <SettingsFormGen userProfile={user} updateUserProfile={updateUserProfile} />;
}

function SettingsFormGen({ userProfile, updateUserProfile }) {
  const [status, { set: setPageStatus }] = useAtom(pageStatusAtom);
  const [localSettings, setLocalSettings] = useState(userProfile);

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

  const onSave = useCallback(() => {
    dispatchMetricsEvent('profile_save');
    // do async put request
    // set loading state for it
    // put response to the currentProfileAtom
    updateUserProfile(localSettings);
  }, [localSettings, updateUserProfile]);

  function dispatchChangeEvent(key: string) {
    if (key === 'language') dispatchMetricsEvent('language_change');
  }

  const onChange = useCallback(
    (key: string) => {
      return (e) => {
        dispatchChangeEvent(key);
        setLocalSettings({ ...localSettings, [key]: e.target?.value ?? e.value });
      };
    },
    [localSettings],
  );

  function toggleUnits() {
    setLocalSettings((prevSettings) => {
      return { ...prevSettings, useMetricUnits: !prevSettings?.useMetricUnits };
    });
  }

  return (
    <>
      <div className={s.contentWrap}>
        <div className={s.navSection}>
          <Heading type="heading-01">{i18n.t('profile.profileSettingsHeader')}</Heading>
          <SettingsNavigation steps={navigationSteps} />
          <div className={s.logoutWrapper}>
            <Button onClick={logout} variant="invert">
              <Text type="short-m">{i18n.t('logout')}</Text>
            </Button>
          </div>
        </div>
        <div className={s.settingsColumn}>
          <div className={s.settingsSection}>
            {featureFlags?.[AppFeature.LLM_ANALYTICS] && (
              <SettingsSection
                id="analysis-objectives"
                className={s.fancySection}
                label={i18n.t('profile.improves_analysis')}
                title={i18n.t('profile.analysis_objectives')}
              >
                <div className={s.descriptionBlock}>
                  {i18n.t('profile.personalization_prompt')}
                  <div className={s.tags}>
                    <span className={clsx(s.tag, 'k-font-caption')}>
                      {i18n.t('profile.your_current_job')}
                    </span>
                    <span className={clsx(s.tag, 'k-font-caption')}>
                      {i18n.t('profile.area_of_expertise')}
                    </span>
                    <span className={clsx(s.tag, 'k-font-caption')}>
                      {i18n.t('profile.challenges')}
                    </span>
                  </div>
                  {i18n.t('profile.ai_tools_compatibility')}
                </div>
                <Textarea
                  topPlaceholder={i18n.t('profile.analysis_objectives')}
                  placeholder={i18n.t('profile.objectives_textarea_placeholder')}
                  value={localSettings.objectives}
                  onChange={onChange('objectives')}
                  classes={{
                    placeholder: s.placeholder,
                  }}
                  className={s.textArea}
                  minHeight="250px"
                  maxHeight="400px"
                />
              </SettingsSection>
            )}
            {featureFlags?.[AppFeature.REFERENCE_AREA] && (
              <SettingsSection
                id="reference-area"
                className={s.fancySection}
                title={i18n.t('profile.reference_area.title')}
                label={i18n.t('profile.improves_analysis')}
              >
                <ReferenceAreaInfo />
              </SettingsSection>
            )}

            <SettingsSection title={i18n.t('profile.your_contacts')} id="your-contacts">
              <div className={s.fieldsWrapper}>
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
                {profileConfig?.phone !== false && (
                  <Input
                    showTopPlaceholder
                    value={localSettings.phone}
                    placeholder={i18n.t('profile.phone_number')}
                    onChange={onChange('phone')}
                  />
                )}
                {profileConfig?.linkedin !== false && (
                  <Input
                    showTopPlaceholder
                    value={localSettings.linkedin}
                    placeholder={i18n.t('profile.linkedin')}
                    onChange={onChange('linkedin')}
                  />
                )}
                <Textarea
                  topPlaceholder={i18n.t('profile.bio_placeholder')}
                  placeholder={i18n.t('profile.bio_textarea_placeholder')}
                  value={localSettings.bio}
                  onChange={onChange('bio')}
                  classes={{
                    placeholder: s.placeholder,
                  }}
                  className={s.textArea}
                  minHeight="250px"
                  maxHeight="400px"
                />
              </div>
            </SettingsSection>

            {profileConfig?.organization_section !== false && (
              <SettingsSection
                title={i18n.t('profile.your_organization')}
                id="your-organization"
              >
                <div className={s.fieldsWrapper}>
                  <Input
                    showTopPlaceholder
                    placeholder={i18n.t('profile.organization_name')}
                    value={localSettings.companyName}
                    onChange={onChange('companyName')}
                  />

                  <Input
                    showTopPlaceholder
                    placeholder={i18n.t('profile.position')}
                    value={localSettings.position}
                    onChange={onChange('position')}
                  />

                  <Select
                    alwaysShowPlaceholder
                    value={localSettings.amountOfGis}
                    items={GIS_SPECIALISTS}
                    withResetButton={false}
                    onSelect={onChange('amountOfGis')}
                  >
                    {i18n.t('profile.gis_specialists')}
                  </Select>
                </div>
              </SettingsSection>
            )}

            <SettingsSection title={i18n.t('profile.appSettingsHeader')} id="settings">
              <div className={s.fieldsWrapper}>
                <Select
                  alwaysShowPlaceholder
                  value={localSettings.language}
                  items={OPTIONS_LANGUAGE}
                  withResetButton={false}
                  onSelect={onChange('language')}
                >
                  {i18n.t('profile.interfaceLanguage')}
                </Select>

                {(featureFlags[AppFeature.FEED_SELECTOR] ||
                  featureFlags[AppFeature.EVENTS_LIST__FEED_SELECTOR]) && (
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

                <div>
                  <Text type="short-l" className={stylesV1.smallTitle}>
                    {i18n.t('profile.units')}
                  </Text>

                  <Radio
                    as="input"
                    id="metric"
                    label={i18n.t('profile.metric')}
                    checked={localSettings.useMetricUnits}
                    onChange={toggleUnits}
                    aria-checked={localSettings.useMetricUnits}
                  />
                  <Radio
                    as="input"
                    id="imperial"
                    label={i18n.t('profile.imperialBeta')}
                    checked={!localSettings.useMetricUnits}
                    onChange={toggleUnits}
                    aria-checked={!localSettings.useMetricUnits}
                  />
                </div>
              </div>
              <div className={s.mobileLogoutWrapper}>
                <Button onClick={logout} variant="invert">
                  <Text type="short-m">{i18n.t('logout')}</Text>
                </Button>
              </div>
            </SettingsSection>
          </div>

          <div className={s.saveWrap}>
            {status === 'loading' ? (
              <div className={s.spinnerContainer}>
                <KonturSpinner />
              </div>
            ) : (
              <div className={s.saveColumn}>
                <Button onClick={onSave} disabled={status !== 'changed'}>
                  <Text type="short-m">{i18n.t('profile.saveButton')}</Text>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
