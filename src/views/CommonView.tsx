import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { useAtom } from '@reatom/react';
import { appConfig } from '~core/app_config';
import { Row } from '~components/Layout';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { useFavicon } from '~utils/hooks/useFavicon';
import { CookieConsentBanner } from '~features/cookie_consent_banner';
import { useTabNameUpdate } from '~utils/hooks/useTabNameUpdate';
import { currentLanguageAtom } from '~core/shared_state/currentLanguage';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
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
  const [featureFlags] = useAtom(featureFlagsAtom);
  const [currentLanguage] = useAtom(currentLanguageAtom);
  useFavicon(appConfig.faviconUrl);
  useTabNameUpdate(appConfig.name);

  useEffect(() => {
    if (featureFlags[FeatureFlag.INTERCOM]) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [featureFlags]);

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
