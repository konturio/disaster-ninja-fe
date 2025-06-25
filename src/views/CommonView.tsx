import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { useAtom } from '@reatom/react-v2';
import { configRepo } from '~core/config';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { CookieConsentBanner } from '~features/cookie_consent_banner';
import { FullScreenLoader } from '~components/LoadingSpinner/LoadingSpinner';
import { AppFeature } from '~core/app/types';
import { KONTUR_DEBUG } from '~utils/debug';
import s from './CommonView.module.css';
import type { AppRoute, AvailableRoutesAtom, CurrentRouteAtom } from '~core/router';
import type { PropsWithChildren } from 'react';

const { NotificationToast } = lazily(() => import('~features/toasts'));
const { SideBar } = lazily(() => import('~features/side_bar'));

const featureFlags = configRepo.get().features;

export function CommonView({
  children,
  currentRouteAtom,
  availableRoutesAtom,
  getAbsoluteRoute,
}: PropsWithChildren<{
  currentRouteAtom: CurrentRouteAtom;
  availableRoutesAtom: AvailableRoutesAtom;
  getAbsoluteRoute: (path: string | AppRoute) => string;
}>) {
  const [currentRoute] = useAtom(currentRouteAtom);

  useEffect(() => {
    if (featureFlags[AppFeature.INTERCOM]) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, []);

  const sanitizedId = configRepo.get().id.replace(/[^a-zA-Z0-9-]/g, '');
  const routeId = currentRoute?.id;

  return (
    <>
      <OriginalLogo />
      <div className={s.common} id={`app-id-${sanitizedId}`}>
        <Suspense fallback={null}>
          {featureFlags[AppFeature.SIDE_BAR] && (
            <SideBar
              availableRoutesAtom={availableRoutesAtom}
              currentRouteAtom={currentRouteAtom}
              getAbsoluteRoute={getAbsoluteRoute}
            />
          )}
        </Suspense>
        <span id={`app-route-${routeId}`} style={{ display: 'contents' }}>
          <Suspense
            fallback={
              <FullScreenLoader message={KONTUR_DEBUG ? 'CommonView: ' + routeId : ''} />
            }
          >
            {children}
          </Suspense>
        </span>
      </div>

      <Suspense fallback={null}>
        {featureFlags[AppFeature.TOASTS] && <NotificationToast />}
      </Suspense>

      {/* FIXME: Since this banner also blocks intercom in should check something more common */}
      {featureFlags[AppFeature.USE_3RDPARTY_ANALYTICS] && <CookieConsentBanner />}
    </>
  );
}
