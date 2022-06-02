import { Button } from '@konturio/ui-kit';
import { authClient, translationService } from '~core/index';
import s from './LoginButton.module.css';

export const LoginButton = () => (
  <Button
    onClick={authClient.showLoginForm}
    size="small"
    dark
    className={s.loginButton}
  >
    {translationService.t('Login')}
  </Button>
);
