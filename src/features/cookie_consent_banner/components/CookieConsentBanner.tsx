import { Button, Card, Heading, Animation } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import ReactMarkdown from 'react-markdown';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import { i18n } from '~core/localization';
import { cookieSettingsAtom } from '../atoms/cookieSettingsAtom';
import s from './CookieConsentBanner.module.css';

export function CookieConsentBanner() {
  const [havePrompts, { acceptAll, rejectAll }] = useAtom(cookieSettingsAtom);
  const [{ data, loading }] = useAtom(userResourceAtom);
  const userModel = data && !loading ? data : null;
  // FIXME: Since this banner also blocks intercom in should check something more common
  if (!userModel?.hasFeature(AppFeature.USE_3RDPARTY_ANALYTICS)) return null;
  return havePrompts ? (
    <Animation variant="fade-in">
      <Card className={s.cookieBanner}>
        <Heading type="heading-04">{i18n.t('cookie_banner.header')}</Heading>
        <div className={s.body}>
          <ReactMarkdown>{i18n.t('cookie_banner.body')}</ReactMarkdown>
        </div>
        <div className={s.buttonsRow}>
          <Button variant="invert-outline" onClick={rejectAll}>
            {i18n.t('cookie_banner.decline_all')}
          </Button>
          <Button onClick={acceptAll}>{i18n.t('cookie_banner.accept_all')}</Button>
        </div>
      </Card>
    </Animation>
  ) : null;
}
