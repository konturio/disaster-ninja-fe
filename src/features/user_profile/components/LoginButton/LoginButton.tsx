import { Button } from '@k2-packages/ui-kit';
import { authClient, translationService } from '~core/index';
import s from './LoginButton.module.css';

export const LoginButton = () => (
  <Button onClick={authClient.showLoginForm} className={s.loginButton}>
    {translationService.t('Login')}
  </Button>
);
