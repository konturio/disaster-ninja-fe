import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { useAtom } from '@reatom/react';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { AppFeature } from '~core/auth/types';
import { urlStoreAtom } from '~core/url_store/atoms/urlStore';
import { forceRun } from '~utils/atoms/forceRun';
import { Row } from '~components/Layout/Layout';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { userResourceAtom } from '~core/auth';
import type { AvailableRoutesAtom, CurrentRouteAtom } from '~core/router';
import type { PropsWithChildren } from 'react';

const { AppHeader } = lazily(() => import('@konturio/ui-kit'));
const { NotificationToast } = lazily(() => import('~features/toasts'));
const { PopupTooltip } = lazily(() => import('~features/tooltip'));
const { SideBar } = lazily(() => import('~features/side_bar'));

const DEFAULT_HEADER_TITLE = 'Disaster Ninja';

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
  const [currentRoute] = useAtom(currentRouteAtom);

  useEffect(() => {
    if (userModel?.hasFeature(AppFeature.INTERCOM)) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [userModel]);

  useEffect(() => {
    return forceRun(urlStoreAtom);
  }, []);

  return (
    <>
      <OriginalLogo />

      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.HEADER) && (
          <AppHeader
            title={currentRoute?.customHeader ?? DEFAULT_HEADER_TITLE}
            logo={VisibleLogo()}
          />
        )}
      </Suspense>

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
    </>
  );
}
