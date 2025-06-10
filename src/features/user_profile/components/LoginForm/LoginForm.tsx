import { Button, Card, Heading, Input, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { authClientInstance } from '~core/authClientInstance';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { testEmail } from '~utils/form/validators';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import s from './LoginForm.module.css';
import { usePersistentError } from './usePersistentError';
import type { ChangeEvent } from 'react';

const authInputClasses = { input: clsx(s.authInput) };

const registrationUrlEncoded = encodeURIComponent(
  `${configRepo.get().keycloakUrl}/realms/${configRepo.get().keycloakRealm}/protocol/openid-connect/registrations?client_id=account&response_type=code&scope=openid&redirect_uri=https://atlas.kontur.io/active/profile`,
);
const registrationUrl = `${configRepo.get().keycloakUrl}/realms/${configRepo.get().keycloakRealm}/protocol/openid-connect/logout?client_id=account&redirect_uri=${registrationUrlEncoded}`;
const resetUrl = `${configRepo.get().keycloakUrl}/realms/${configRepo.get().keycloakRealm}/login-actions/reset-credentials?client_id=account`;

export function LoginForm() {
  const ERROR_VISIBLE_MS = 5000;
  const { error, setPersistentError, clear } = usePersistentError<{
    email?: string;
    password?: string;
    general?: string;
  }>(ERROR_VISIBLE_MS);
  const [formData, setFormData] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const onEmailInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (error.email) {
        clear();
      }
      setFormData({ ...formData, email: ev.target.value });
    },
    [formData, error, clear],
  );

  const onPasswordInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (error.password) {
        clear();
      }
      setFormData({ ...formData, password: ev.target.value });
    },
    [formData, error, clear],
  );

  const onForgotPasswordClick = useCallback(
    () => dispatchMetricsEvent('forgot_password'),
    [],
  );
  const onSignUpClick = useCallback(() => dispatchMetricsEvent('sign_up'), []);

  const onLoginClick = useCallback(async () => {
    const err: { email?: string; password?: string; general?: string } = {};
    if (!formData.email?.length) {
      err.email = i18n.t('login.error.email_empty');
    } else {
      if (!testEmail(formData.email)) {
        err.email = i18n.t('login.error.email_invalid');
      }
    }
    if (!formData.password?.length) {
      err.password = i18n.t('login.error.password');
    }
    if (err.email || err.password) {
      setPersistentError(err);
    } else {
      setLoading(true);
      const authResponse = await authClientInstance.authenticate(
        formData.email || '',
        formData.password || '',
      );
      setLoading(false);
      if (authResponse !== true) {
        dispatchMetricsEvent('login_failure');
        if (typeof authResponse === 'string') {
          setPersistentError({ general: authResponse });
        } else {
          setPersistentError({ general: i18n.t('login.error.connect') });
        }
      } else {
        dispatchMetricsEvent('login_success');
      }
    }
  }, [formData]);

  useEffect(() => {
    if (formRef.current) {
      const keyDownListener = (ev: KeyboardEvent) => {
        if (ev.key === 'Enter') {
          onLoginClick();
        }
      };
      formRef.current.addEventListener('keydown', keyDownListener);

      return () => {
        formRef?.current?.removeEventListener('keydown', keyDownListener);
        clear();
      };
    }
  }, [formRef.current, formData]);

  return (
    <Card ref={formRef} className={s.modalCard}>
      {loading && (
        <div className={s.loadingContainer}>
          <LoadingSpinner message={i18n.t('login.logging_in')} />
        </div>
      )}
      <Heading type="heading-01">{i18n.t('login.log_in')}</Heading>
      <div className={s.loginDescription}>
        <Text type="short-m">{i18n.t('login.description')}</Text>
      </div>
      <div className={s.inputsContainer}>
        <Input
          error={error.email || ''}
          classes={authInputClasses}
          showTopPlaceholder
          value={formData.email || ''}
          onChange={onEmailInputChange}
          placeholder={i18n.t('login.email')}
        />
        {error.email && <div className={s.fieldError}>{error.email}</div>}
        <Input
          error={error.password || ''}
          classes={authInputClasses}
          showTopPlaceholder
          value={formData.password || ''}
          onChange={onPasswordInputChange}
          placeholder={i18n.t('login.password')}
          type="password"
        />
        {error.password && <div className={s.fieldError}>{error.password}</div>}
      </div>
      {error.general && <div className={s.errorMessageContainer}>{error.general}</div>}
      <div className={clsx(s.link, s.forgotPasswordContainer)}>
        <a
          href={resetUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onForgotPasswordClick}
        >
          {i18n.t('login.forgot_password')}
        </a>
      </div>
      <div className={s.loginButtonContainer}>
        <Button onClick={onLoginClick} className={s.loginButton}>
          {i18n.t('login.log_in')}
        </Button>
      </div>
      <div className={clsx(s.link, s.registerContainter)}>
        <a
          href={registrationUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onSignUpClick}
        >
          {i18n.t('login.sign_up')}
        </a>
      </div>
    </Card>
  );
}
