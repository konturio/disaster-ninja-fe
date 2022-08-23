import { Button, Card, Input, Modal, Text } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/react';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { testEmail } from '~utils/form/validators';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { userStateAtom } from '~core/auth/atoms/userState';
import s from './LoginForm.module.css';
import type { ChangeEvent } from 'react';

const authInputClasses = { input: clsx(s.authInput) };

export function LoginForm() {
  const [userState] = useAtom(userStateAtom);

  const onCloseFormCallback = useAction(() => {
    authClientInstance.closeLoginForm();
  }, []);

  const [error, setError] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [formData, setFormData] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const onEmailInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (error.email) {
        setError({ ...error, email: undefined });
      }
      setFormData({ ...formData, email: ev.target.value });
    },
    [formData, setFormData, error, setError],
  );

  const onPasswordInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (error.password) {
        setError({ ...error, password: undefined });
      }
      setFormData({ ...formData, password: ev.target.value });
    },
    [formData, setFormData, error, setError],
  );

  const onLoginClick = async () => {
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
      setError(err);
    } else {
      setLoading(true);
      const authResponse = await authClientInstance.authenticate(
        formData.email || '',
        formData.password || '',
      );
      setLoading(false);
      if (authResponse !== true) {
        if (typeof authResponse === 'string') {
          setError({ general: authResponse });
        } else {
          setError({
            general: i18n.t('login.error.connect'),
          });
        }
      }
    }
  };

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
      };
    }
  }, [formRef.current, formData]);

  return userState === 'logging_in' ? (
    <Modal
      onModalCloseCallback={onCloseFormCallback}
      className={s.modalContainer}
    >
      <Card ref={formRef} className={s.modalCard}>
        {loading && (
          <div className={s.loadingContainer}>
            <LoadingSpinner message={i18n.t('login.logging_in')} />
          </div>
        )}
        <Text type="heading-xl">{i18n.t('login.log_in')}</Text>
        {/*<div className={s.socialLoginContainer}>*/}
        {/*  <Button className={s.socialButton} iconBefore={<SocialLoginIcon type='google' />}>{i18n.t('Google')}</Button>*/}
        {/*  <Button className={s.socialButton} iconBefore={<SocialLoginIcon type='github' />}>{i18n.t('Github')}</Button>*/}
        {/*  <Button className={s.socialButton} iconBefore={<SocialLoginIcon type='osm' />}>{i18n.t('OSM')}</Button>*/}
        {/*</div>*/}
        {/*<div className={s.useEmailLabelContainer}>*/}
        {/*  <div className={s.useEmailLabel}>{i18n.t('or use email')}</div>*/}
        {/*</div>*/}
        <div className={s.inputsContainer}>
          <Input
            error={error.email}
            classes={authInputClasses}
            showTopPlaceholder
            value={formData.email}
            onChange={onEmailInputChange}
            placeholder={i18n.t('login.email')}
          />
          <Input
            error={error.password}
            classes={authInputClasses}
            showTopPlaceholder
            value={formData.password}
            onChange={onPasswordInputChange}
            placeholder={i18n.t('login.password')}
            type="password"
          />
        </div>
        {error.general && (
          <div className={s.errorMessageContainer}>{error.general}</div>
        )}
        {/*<div className={clsx(s.link, s.forgotPasswordContainer)}>{i18n.t('Forgot password?')}</div>*/}
        <div className={clsx(s.link, s.registerContainter)}>
          <a
            href="https://www.kontur.io/portfolio/event-feed-draft/#publicfeed"
            target="_blank"
            rel="noreferrer"
          >
            {i18n.t('login.sign_up')}
          </a>
        </div>
        <div className={s.loginButtonContainer}>
          <Button onClick={onLoginClick} className={s.loginButton}>
            {i18n.t('login.log_in')}
          </Button>
        </div>
        {/*<div className={s.signUpContainer}>*/}
        {/*  <span>{i18n.t('Don\'t have an account?')}</span>*/}
        {/*  &nbsp;&nbsp;*/}
        {/*  <span className={s.link}>{i18n.t('Sign up')}</span>*/}
        {/*</div>*/}
      </Card>
    </Modal>
  ) : null;
}
