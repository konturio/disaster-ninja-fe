import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { useAtom } from '@reatom/react-v2';
import { configRepo } from '~core/config';
import { Row } from '~components/Layout';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { CookieConsentBanner } from '~features/cookie_consent_banner';
import { useTabNameUpdate } from '~utils/hooks/useTabNameUpdate';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import type { AppRoute, AvailableRoutesAtom, CurrentRouteAtom } from '~core/router';
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
  getAbsoluteRoute: (path: string | AppRoute) => string;
}>) {
  const [featureFlags] = useAtom(featureFlagsAtom);
  useTabNameUpdate(configRepo.get().name);

  useEffect(() => {
    if (featureFlags[FeatureFlag.INTERCOM]) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [featureFlags[FeatureFlag.INTERCOM]]);

  return (
    <>
      <OriginalLogo />
      <Row>
        <Suspense fallback={null}>
          {featureFlags[FeatureFlag.SIDE_BAR] && (
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
        {featureFlags[FeatureFlag.TOASTS] && <NotificationToast />}
      </Suspense>

      <Suspense fallback={null}>
        {featureFlags[FeatureFlag.TOOLTIP] && <PopupTooltip />}
      </Suspense>

      {/* FIXME: Since this banner also blocks intercom in should check something more common */}
      {featureFlags[FeatureFlag.USE_3RDPARTY_ANALYTICS] && <CookieConsentBanner />}
    </>
  );
}
