import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { useAtom } from '@reatom/react';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { Row } from '~components/Layout/Layout';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { RouterContext } from '~core/router';
import core from '~core/index';
import { AppFeature } from '~core/app_features';

const { AppHeader } = lazily(() => import('@konturio/ui-kit'));
const { NotificationToast } = lazily(() => import('~features/toasts'));
const { PopupTooltip } = lazily(() => import('~features/tooltip'));
const { SideBar } = lazily(() => import('~features/side_bar'));

const DEFAULT_HEADER_TITLE = 'Disaster Ninja';

export function Views() {
  useAtom(core.urlStore.atom)
  const [features] = useAtom(core.features.atom);
  const [currentRoute] = useAtom(core.router.atoms.currentRouteAtom);

  useEffect(() => {
    if (features.has(AppFeature.INTERCOM)) {
      core.intercom.init();
    }
  }, [features]);

  useEffect(() => {
    if (core.currentUser.userWasLanded()) {
      core.router.showIntro()
    }
  }, [])

  return (
    <>
      <OriginalLogo />

      <Suspense fallback={null}>
        {features.has(AppFeature.HEADER) && (
          <AppHeader
            title={currentRoute?.customHeader ?? DEFAULT_HEADER_TITLE}
            logo={VisibleLogo()}
          />
        )}
      </Suspense>

      <Row>
        <RouterContext>
          <Suspense fallback={null}>
            {features.has(AppFeature.SIDE_BAR) && <SideBar />}
          </Suspense>
        </RouterContext>
      </Row>

      <Suspense fallback={null}>
        {features.has(AppFeature.TOASTS) && <NotificationToast />}
      </Suspense>

      <Suspense fallback={null}>
        {features.has(AppFeature.TOOLTIP) && <PopupTooltip />}
      </Suspense>
    </>
  );
}
