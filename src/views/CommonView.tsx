import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { useAtom } from '@reatom/react';
import { AppFeature } from '~core/auth/types';
import { Row } from '~components/Layout';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { userResourceAtom } from '~core/auth';
import { currentAppPropertiesResourceAtom } from '~core/shared_state/currentApplication';
import { useFavicon } from '~utils/hooks/useFavicon';
import { CookieConsentBanner } from '~features/cookie_consent_banner';
import type { AvailableRoutesAtom, CurrentRouteAtom } from '~core/router';
import type { PropsWithChildren } from 'react';

const { NotificationToast } = lazily(() => import('~features/toasts'));
const { PopupTooltip } = lazily(() => import('~features/tooltip'));
const { SideBar } = lazily(() => import('~features/side_bar'));

export function CommonView({
  children,
  currentRouteAtom,
  availableRoutesAtom,
  getAbsoluteRoute,
}: PropsWithChildren<{
  currentRouteAtom: CurrentRouteAtom;
  availableRoutesAtom: AvailableRoutesAtom;
  getAbsoluteRoute: (path: string) => string;
}>) {
  const [{ data, loading }] = useAtom(userResourceAtom);
  const userModel = data && !loading ? data : null;
  const [{ data: appParams }] = useAtom(currentAppPropertiesResourceAtom);

  useFavicon(appParams?.faviconUrl);

  useEffect(() => {
    if (userModel?.hasFeature(AppFeature.INTERCOM)) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [userModel]);

  return (
    <>
      <OriginalLogo />
      <Row>
        <Suspense fallback={null}>
          {userModel?.hasFeature(AppFeature.SIDE_BAR) && (
            <SideBar
              availableRoutesAtom={availableRoutesAtom}
              currentRouteAtom={currentRouteAtom}
              getAbsoluteRoute={getAbsoluteRoute}
            />
          )}
        </Suspense>
        {children}
      </Row>

      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOASTS) && <NotificationToast />}
      </Suspense>

      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOOLTIP) && <PopupTooltip />}
      </Suspense>

      {/* FIXME: Since this banner also blocks intercom in should check something more common */}
      {userModel?.hasFeature(AppFeature.USE_3RDPARTY_ANALYTICS) && (
        <CookieConsentBanner />
      )}
    </>
  );
}
