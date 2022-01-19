import { Button, Card, Input, Modal, Text } from '@k2-packages/ui-kit';
import { useAction, useAtom } from '@reatom/react';
import { currentUserAtom } from '~core/auth';
import s from './LoginForm.module.css';
import { authClient, keycloakClient, translationService as i18n } from '~core/index';
import { SocialLoginIcon } from '~components/SocialLoginIcon/SocialLoginIcon';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { testEmail } from '~utils/forms/formsUtils';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';

export function LoginForm() {
  const [currentUser, userActions] = useAtom(currentUserAtom);

  const onCloseFormCallback = useAction(() => {
    userActions.setUser();
  }, []);

  const [error, setError] = useState<{ email?: string, password?: string, general?: string }>({});
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onEmailInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (error.email) {
      setError({...error, email: undefined })
    }
    setEmail(ev.target.value);
  };

  const onPasswordInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (error.password) {
      setError({...error, password: undefined })
    }
    setPassword(ev.target.value);
  };

  const onLoginClick = () => {
    const err: {email?: string; password?: string; general?: string; } = {};
    if (!email.length) {
      err.email = i18n.t('Email has not to be empty!');
    } else {
      if (!testEmail(email)) {
        err.email = i18n.t('Email has to be valid!');
      }
    }
    if (!password.length) {
      err.password = i18n.t('Password has not to be empty!');
    }
    if (err.email || err.password) {
      setError(err);
    } else {
      setLoading(true);
      setTimeout(async () => {
        setLoading(false);
        const authResponse = await authClient.authenticate(email, password);
        if (email !== 'test@test.com' || password !== '1234') {
          setError({ general: 'Incorrect username or password!'});
        } else {
          userActions.setUser({ name: 'test@test.com', token: '123' });
        }
      }, 1000 + Math.random() * 3000 );
    }
  };

  return currentUser.userState === 'logging_in' ? (
    <Modal onModalCloseCallback={onCloseFormCallback}>
      <Card className={s.modalCard}>
        {loading && (
          <div className={s.loadingContainer}>
            <LoadingSpinner message={i18n.t('Logging in...')} />
          </div>
        )}
        <Text type="heading-xl">{i18n.t('Log in')}</Text>
        <div className={s.socialLoginContainer}>
          <Button className={s.socialButton} iconBefore={<SocialLoginIcon type='google' />}>{i18n.t('Google')}</Button>
          <Button className={s.socialButton} iconBefore={<SocialLoginIcon type='github' />}>{i18n.t('Github')}</Button>
          <Button className={s.socialButton} iconBefore={<SocialLoginIcon type='osm' />}>{i18n.t('OSM')}</Button>
        </div>
        <div className={s.useEmailLabelContainer}>
          <div className={s.useEmailLabel}>{i18n.t('or use email')}</div>
        </div>
        <div className={s.inputsContainer}>
          <Input error={error.email} showTopPlaceholder className={s.inputBox}
                 classes={{
                   input: clsx(s.input, error.email && s.inputError),
                   topPlaceholder: clsx(s.topPlaceholder, error.email && s.topPlaceholderError),
                   error: s.errorMessage,
                 }}
                 onChange={onEmailInputChange}
                 placeholder={i18n.t('Email')} />
          <Input error={error.password} showTopPlaceholder
                 className={s.inputBox} classes={{
                   input: clsx(s.input, error.password && s.inputError),
                   topPlaceholder: clsx(s.topPlaceholder, error.password && s.topPlaceholderError),
                   error: s.errorMessage,
                 }}
                 onChange={onPasswordInputChange}
                 placeholder={i18n.t('Password')} type='password' />
        </div>
        {error.general && <div className={s.errorMessageContainer}>{error.general}</div>}
        <div className={clsx(s.link, s.forgotPasswordContainer)}>{i18n.t('Forgot password?')}</div>
        <div className={s.loginButtonContainer}>
          <Button onClick={onLoginClick} className={s.loginButton}>{i18n.t('Log in')}</Button>
        </div>
        <div className={s.signUpContainer}>
          <span>{i18n.t('Don\'t have an account?')}</span>
          &nbsp;&nbsp;
          <span className={s.link}>{i18n.t('Sign up')}</span>
        </div>
      </Card>
    </Modal>
  ) : null;
}
