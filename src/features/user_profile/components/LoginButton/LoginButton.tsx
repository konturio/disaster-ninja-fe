import { Button } from '@konturio/ui-kit';
import core from '~core/index';
import s from './LoginButton.module.css';

export const LoginButton = () => (
  <Button
    onClick={core.api.authClient.showLoginForm}
    size="small"
    dark
    className={s.loginButton}
  >
    {core.i18n.t('login.login_button')}
  </Button>
);
