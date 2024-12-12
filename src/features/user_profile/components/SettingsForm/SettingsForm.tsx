import { Button, Input, Radio, Select, Text, Heading, Textarea } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { lazily } from 'react-lazily';
import { Element, scrollSpy } from 'react-scroll';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { flatObjectsAreEqual } from '~utils/common';
import { DEFAULT_OSM_EDITOR } from '~core/constants';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { AppFeature } from '~core/app/types';
import {
  OPTIONS_LANGUAGE,
  OPTIONS_OSM,
} from '~features/user_profile/components/SettingsForm/common';
import { SettingsNavigation } from '~features/user_profile/components/SettingsForm/SettingsNavigation/SettingsNavigation';
import { SettingsSection } from '~features/user_profile/components/SettingsForm/SettingsSection/SettingsSection';
import stylesV1 from '~features/user_profile/components/SettingsForm/SettingsForm.module.css';
import { currentProfileAtom, pageStatusAtom } from '../../atoms/userProfile';
import s from './SettingsForm.module.css';

const { ReferenceAreaInfo } = lazily(
  () => import('./ReferenceAreaInfo/ReferenceAreaInfo'),
);
const { SelectFeeds } = lazily(() => import('./SelectFeeds'));

const authInputClasses = { input: clsx(s.authInput) };
const steps = ['Analysis objectives', 'Reference area', 'contacts', 'Settings'];

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
  const [status, { set: setPageStatus }] = useAtom(pageStatusAtom);
  const featureFlags = configRepo.get().features;

  const [localSettings, setLocalSettings] = useState(userProfile);
  // Create a ref for the scrollable container
  const scrollableContainerRef = useRef(null);
  // Create a ref for each section to observe them

  useEffect(() => {
    scrollSpy.update();
  }, []);

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
      <div className={s.contentWrap} id="scroll-container">
        <div className={s.navSection}>
          <Heading type="heading-01">{i18n.t('profile.profileSettingsHeader')}</Heading>
          <SettingsNavigation steps={steps} />
          <div className={s.logoutWrapper}>
            <Button onClick={logout} variant="invert">
              <Text type="short-m">{i18n.t('logout')}</Text>
            </Button>
          </div>
        </div>
        <div className={s.settingsColumn}>
          <div className={s.settingsSection} ref={scrollableContainerRef}>
            <Element name={`test-0`}>
              <SettingsSection
                className={s.recommendedSection}
                label="Improves analysis"
                title="Analysis objectives"
                id="test-0"
              >
                <div className={s.descriptionBlock}>
                  For better personalization, please include details like
                  <div className={s.tags}>
                    <span className={clsx(s.tag, 'k-font-caption')}>
                      your current goals
                    </span>
                    <span className={clsx(s.tag, 'k-font-caption')}>
                      area of expertise
                    </span>
                    <span className={clsx(s.tag, 'k-font-caption')}>challenges</span>
                  </div>
                  This information is compatible with AI tools
                </div>
                <Textarea
                  topPlaceholder="bio"
                  placeholder="Example: GIS Analyst in urban planning, interested in climate resilience. My current challenge is optimizing flood risk maps."
                  value={localSettings.bio}
                  onChange={onChange('bio')}
                  classes={{
                    placeholder: s.placeholder,
                  }}
                  className={stylesV1.textArea}
                  width="100%"
                  minHeight="250px"
                  maxHeight="400px"
                />
              </SettingsSection>
            </Element>
            {featureFlags?.[AppFeature.REFERENCE_AREA] && (
              <Element name={`test-1`}>
                <SettingsSection
                  className={s.recommendedSection}
                  title={i18n.t('profile.reference_area.title')}
                  label="Improves analysis"
                  id="test-1"
                >
                  <ReferenceAreaInfo />
                </SettingsSection>
              </Element>
            )}

            <Element name={`test-2`}>
              <SettingsSection title={i18n.t('profile.your_contacts')} id="test-2">
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
                </div>
              </SettingsSection>
            </Element>

            <Element name={`test-3`}>
              <SettingsSection title={i18n.t('profile.appSettingsHeader')} id="test-3">
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
                    />
                    <Radio
                      as="input"
                      id="imperial"
                      label={i18n.t('profile.imperialBeta')}
                      checked={!localSettings.useMetricUnits}
                      onChange={toggleUnits}
                    />
                  </div>
                </div>
              </SettingsSection>
            </Element>
          </div>

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
    </>
  );
}
