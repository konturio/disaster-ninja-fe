import { useAtom } from '@reatom/react';
import { cookieSettingsAtom } from '../atoms/cookieSettingsAtom';
import s from './CookieConsentBanner.module.css';

export function CookieConsentBanner() {
  const [havePrompts, { acceptAll, rejectAll }] = useAtom(cookieSettingsAtom);

  return havePrompts ? (
    <div className={s.cookieBanner}>
      <button onClick={rejectAll}>Reject</button>
      <button onClick={acceptAll}>AcceptAll</button>
    </div>
  ) : null;
}
