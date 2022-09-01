import { Button } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { authClientInstance } from '~core/authClientInstance';
import s from './LoginButton.module.css';

export const LoginButton = () => (
  <Button
    onClick={authClientInstance.showLoginForm}
    size="small"
    dark
    className={s.loginButton}
  >
    {i18n.t('login.login_button')}
  </Button>
);
