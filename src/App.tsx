import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/react';
import { StrictMode } from 'react';
import { store } from '~core/store/store';
import { AuthWrapper } from '~core/auth';
import { Router } from '~core/router';
import { CookieConsentBanner } from '~features/cookie_consent_banner';
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <reatomContext.Provider value={store}>
      <AuthWrapper>
        <Router />
        <CookieConsentBanner />
      </AuthWrapper>
    </reatomContext.Provider>
  </StrictMode>,
);
