import { Button } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import s from './OAMAuthRequired.module.css';
import type { OAMAuthFeatureConfig } from '~core/config/types';

function OAMAuthRequired() {
  const oamAuthConfig = configRepo.get().features[
    AppFeature.OAM_AUTH
  ] as OAMAuthFeatureConfig;
  const { authUrl, redirectUriParamName } = oamAuthConfig;

  return (
    <div className={s.pageContainer}>
      <a
        href={`${authUrl}?${redirectUriParamName}=${encodeURIComponent(window.location.href)}`}
        className={s.loginButton}
      >
        <Button>{i18n.t('oam_auth.login_button')}</Button>
      </a>
    </div>
  );
}

export { OAMAuthRequired };
