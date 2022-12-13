import { useAtom } from '@reatom/react';
import { cookieSettingsAtom } from '../atoms/cookieSettingsAtom';

export function CookieConsentBanner() {
  const [cookieSettings, { applyAll, rejectAll }] = useAtom(cookieSettingsAtom);

  return <div>
    <button onClick={rejectAll}>Reject</button>
    <button onClick={applyAll}>AcceptAll</button>
  </div>;
}
