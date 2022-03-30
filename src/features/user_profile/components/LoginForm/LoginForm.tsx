import { Button, Card, Input, Modal, Text } from '@k2-packages/ui-kit';
import { useAction, useAtom } from '@reatom/react';
import s from './LoginForm.module.css';
import { authClient, translationService as i18n } from '~core/index';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { testEmail } from '~utils/forms/formsUtils';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { userStateAtom } from '~core/auth/atoms/userState';

export function LoginForm() {
  const [userState] = useAtom(userStateAtom);

  const onCloseFormCallback = useAction(() => {
    authClient.closeLoginForm();
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
      err.email = i18n.t('Email has not to be empty!');
    } else {
      if (!testEmail(formData.email)) {
        err.email = i18n.t('Email has to be valid!');
      }
    }
    if (!formData.password?.length) {
      err.password = i18n.t('Password has not to be empty!');
    }
    if (err.email || err.password) {
      setError(err);
    } else {
      setLoading(true);
      const authResponse = await authClient.authenticate(
        formData.email || '',
        formData.password || '',
      );
      setLoading(false);
      if (authResponse !== true) {
        if (typeof authResponse === 'string') {
          setError({ general: authResponse });
        } else {
          setError({
            general: i18n.t("Couldn't connect to authentication service"),
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
    <Modal onModalCloseCallback={onCloseFormCallback}>
      <Card ref={formRef} className={s.modalCard}>
        {loading && (
          <div className={s.loadingContainer}>
            <LoadingSpinner message={i18n.t('Logging in...')} />
          </div>
        )}
        <Text type="heading-xl">{i18n.t('Log in')}</Text>
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
            showTopPlaceholder
            className={s.inputBox}
            classes={{
              input: clsx(s.input, error.email && s.inputError),
              topPlaceholder: clsx(
                s.topPlaceholder,
                error.email && s.topPlaceholderError,
              ),
              error: s.errorMessage,
            }}
            onChange={onEmailInputChange}
            placeholder={i18n.t('Email')}
          />
          <Input
            error={error.password}
            showTopPlaceholder
            className={s.inputBox}
            classes={{
              input: clsx(s.input, error.password && s.inputError),
              topPlaceholder: clsx(
                s.topPlaceholder,
                error.password && s.topPlaceholderError,
              ),
              error: s.errorMessage,
            }}
            onChange={onPasswordInputChange}
            placeholder={i18n.t('Password')}
            type="password"
          />
        </div>
        {error.general && (
          <div className={s.errorMessageContainer}>{error.general}</div>
        )}
        {/*<div className={clsx(s.link, s.forgotPasswordContainer)}>{i18n.t('Forgot password?')}</div>*/}
        <div className={s.loginButtonContainer}>
          <Button onClick={onLoginClick} className={s.loginButton}>
            {i18n.t('Log in')}
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
