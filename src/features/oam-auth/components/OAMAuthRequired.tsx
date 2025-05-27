import { Button } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import s from './OAMAuthRequired.module.css';

function OAMAuthRequired() {
  const oamAuthUrl = configRepo.get().oamAuthUrl;

  return (
    <div className={s.pageContainer}>
      <a
        href={`${oamAuthUrl}?original_uri=${encodeURIComponent(window.location.href)}`}
        className={s.loginButton}
      >
        <Button>{i18n.t('oam_auth.login_button')}</Button>
      </a>
    </div>
  );
}

export { OAMAuthRequired };
